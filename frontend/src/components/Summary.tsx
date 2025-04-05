import React, { useState, useEffect, useRef } from 'react';
import { Course } from '../types';
import { generateSchedule } from '../utils/dateUtils';
import { AuthModal } from './AuthModal';
import { holidayNames } from '../utils/holidays';
import { Container, Paper, Typography, Box, Grid, Button, Autocomplete, TextField, Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO, startOfWeek, differenceInCalendarWeeks } from 'date-fns';
import { saveAs } from 'file-saver';
import { createEvents, EventAttributes } from 'ics';

interface SummaryProps {
  course: Course;
  user: { email: string; password: string } | null;
  onLogin: (user: { email: string; password: string }) => void;
}

export const Summary: React.FC<SummaryProps> = ({ course, user, onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notes, setNotes] = useState<{ [date: string]: string[] }>({});
  const [courses, setCourses] = useState<{ courseName: string; courseCode: string }[]>([]);
  const [syllabusTopics, setSyllabusTopics] = useState<{ _id: string; topic: string; number: string }[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<{ courseName: string; courseCode: string } | null>(null);
  const [subject, setSubject] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customDates, setCustomDates] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [customTopics, setCustomTopics] = useState<{ topic: string; number: string }[]>([]);
  const schedule = generateSchedule(course);
  const printRef = useRef<HTMLDivElement>(null);
  
  const downloadICS = () => {
    const events: EventAttributes[] = schedule.map((date) => {
      const topics = notes[date]?.join(', ') || 'No topics';
      return {
        start: date.split('-').map(Number) as [number, number, number],
        title: `${course.name} - ${topics}`,
        description: `Course: ${course.name}\nTopics: ${topics}`,
        duration: { hours: 1 },
      };
    });

    createEvents(events, (error, value) => {
      if (error) {
        console.error('Error generating ICS file:', error);
        return;
      }
      const blob = new Blob([value || ''], { type: 'text/calendar;charset=utf-8' });
      saveAs(blob, `${course.name}_schedule.ics`);
    });
  };
  const downloadCSV = () => {
    const headers = ['Date', 'Course', 'Topics'];
    const rows = schedule.map((date) => {
      const topics = notes[date]?.join(', ') || 'No topics';
      return `${date},${course.name},${topics}`;
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${course.name}_schedule.csv`);
  };



  useEffect(() => {
    const fetchCourses = async () => {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        alert("Please login first!");
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:5001/api/syllabus/courses", {
        headers: {
          "Authorization": `Bearer ${userToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        alert("Error fetching courses!");
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchSyllabusTopics = async () => {
      if (!selectedCourse) return;

      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        alert("Please login first!");
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`http://localhost:5001/api/syllabus/syllabus/${selectedCourse.courseCode}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSyllabusTopics(data);
      } else {
        alert("Error fetching syllabus topics!");
      }
    };

    fetchSyllabusTopics();
  }, [selectedCourse]);

  const printDocument = () => {
    const printContent = printRef.current?.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow && printContent) {
      printWindow.document.write('<html><head><title>Print Document</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        h2, h3, h4 {
          color: #1565c0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .course-info {
          margin-bottom: 20px;
        }
        .course-info div {
          margin-bottom: 5px;
        }
      `);
      printWindow.document.write('</style></head><body >');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleLogin = (user: { email: string; password: string }) => {
    console.log('Login attempted:', user);
    setShowAuthModal(false);
    onLogin(user);
  };

  const handleNoteChange = (date: string, topics: string[]) => {
    setNotes({ ...notes, [date]: topics });
  };

  const handleAddCustomDate = () => {
    if (customDate && !customDates.includes(customDate)) {
      setCustomDates([...customDates, customDate].sort());
      setCustomDate('');
    }
  };

  const handleRemoveCustomDate = (date: string) => {
    setCustomDates(customDates.filter(d => d !== date));
  };

  const handleAddCustomTopic = () => {
    if (customTopic && !customTopics.some(topic => topic.topic === customTopic)) {
      const newNumber = (customTopics.length + 1).toString();
      setCustomTopics([...customTopics, { topic: customTopic, number: newNumber }]);
      setCustomTopic('');
    }
  };

  const removedHolidays = course.excludedDates
    .filter(date => holidayNames[date])
    .map(date => `${date} (${holidayNames[date]})`);

  const combinedSchedule = [...schedule, ...customDates].sort();

  const getWeekNumber = (date: string) => {
    const startDate = parseISO(course.startDate);
    const currentDate = parseISO(date);
    return differenceInCalendarWeeks(currentDate, startDate, { weekStartsOn: 1 }) + 1;
  };

  const groupedSchedule = combinedSchedule.reduce((acc, date) => {
    const weekNumber = getWeekNumber(date);
    if (!acc[weekNumber]) {
      acc[weekNumber] = [];
    }
    acc[weekNumber].push(date);
    return acc;
  }, {} as { [weekNumber: number]: string[] });

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#e3f2fd' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1565c0' }}>
          Course Schedule Summary
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1565c0' }}>
                Course Duration
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Arial, sans-serif', color: '#1565c0' }}>
                Total Weeks: {Math.ceil(combinedSchedule.length / course.selectedDays.length)}
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Arial, sans-serif', color: '#1565c0' }}>
                Teaching Days: {combinedSchedule.length}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1565c0' }}>
                Schedule Details
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Arial, sans-serif', color: '#1565c0' }}>
                Selected Days: {course.selectedDays.join(', ')}
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Arial, sans-serif', color: '#1565c0' }}>
                Excluded Dates: {course.excludedDates.length}
              </Typography>
              {removedHolidays.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1565c0' }}>
                    Removed National Holidays:
                  </Typography>
                  <ul>
                    {removedHolidays.map((holiday, index) => (
                      <li key={index} style={{ color: '#1565c0' }}>{holiday}</li>
                    ))}
                  </ul>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* { <Box sx={{ mt: 4 }}>
          <Button
            onClick={() => setShowAuthModal(true)}
            variant="contained"
            color="primary"
            startIcon={<Calendar />}
            fullWidth
          >
            Add to Calendar
          </Button>
        </Box>  */}
        
         <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1565c0' }}>
                Teaching Schedule
              </Typography>
              <ul>
                {schedule.map((date) => (
                  <li key={date}>
                    {date} - {notes[date]?.join(', ') || 'No topics'}
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
        </Box>

<label htmlFor="8."></label>
        <Box sx={{ mt: 4 }}>
          <Autocomplete
            options={courses}
            getOptionLabel={(option) => option.courseName}
            value={selectedCourse}
            onChange={(event, newValue) => setSelectedCourse(newValue)}
            renderInput={(params) => <TextField {...params} label="Select Course Name" variant="outlined" />}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1565c0' }}>
            Teaching Schedule
          </Typography>
          <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 2 }}>
            {Object.entries(groupedSchedule).map(([weekNumber, dates]) => (
              <React.Fragment key={weekNumber}>
                <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center', bgcolor: '#bbdefb', p: 1, borderRadius: 1, mt: 2 }}>
                  <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1565c0' }}>
                      Week {weekNumber}
                    </Typography>
                  </Grid>
                </Grid>
                {dates.map(date => (
                  <Grid container spacing={2} key={date} sx={{ mb: 2, alignItems: 'center' }}>
                    <Grid item xs={12} sm={4} sx={{ mt: 1 }}>
                      <Typography variant="body1" sx={{ fontFamily: 'Arial, sans-serif', color: '#1565c0' }}>
                        {date}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={7} sx={{ mt: 1 }}>
                      <Autocomplete
                        multiple
                        options={[...syllabusTopics.map(topic => `${topic.number} - ${topic.topic}`), ...customTopics.map(topic => `${topic.number} - ${topic.topic}`)]}
                        getOptionLabel={(option) => option}
                        value={notes[date] || []}
                        onChange={(event, newValue) => handleNoteChange(date, newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip key={index} label={option} {...getTagProps({ index })} />
                          ))
                        }
                        renderInput={(params) => <TextField {...params} label="Select Topic" variant="outlined" />}
                      />
                    </Grid>
                    {customDates.includes(date) && (
                      <Grid item xs={12} sm={1} sx={{ mt: 1 }}>
                        <IconButton onClick={() => handleRemoveCustomDate(date)} color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                ))}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1565c0' }}>
            Add Custom Date
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              variant="outlined"
              sx={{ flexGrow: 1 }}
            />
            <Button
              onClick={handleAddCustomDate}
              variant="contained"
              color="primary"
            >
              Add Date
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1565c0' }}>
            Add Custom Topic
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              variant="outlined"
              placeholder="Enter custom topic"
              sx={{ flexGrow: 1 }}
            />
            <Button
              onClick={handleAddCustomTopic}
              variant="contained"
              color="primary"
            >
              Add Topic
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={printDocument}
            variant="contained"
            color="primary"
          >
            Print Document
          </Button>
        </Box>

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
          />
        )}

        <div ref={printRef} style={{ display: 'none' }}>
          <style>
            {`
              @media print {
                body {
                  margin: 20px;
                  font-family: Arial, sans-serif;
                }
                h2, h3, h4 {
                  color: #1565c0;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
                th, td {
                  border: 1px solid black;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
                .course-info {
                  margin-bottom: 20px;
                }
                .course-info div {
                  margin-bottom: 5px;
                }
              }
            `}
          </style>
          <h2>Course Schedule Summary</h2>
          <div className="course-info">
            <div><strong>Course Name:</strong> {selectedCourse?.courseName || 'N/A'}</div>
            <div><strong>Course Code:</strong> {selectedCourse?.courseCode || 'N/A'}</div>
            <div><strong>Duration:</strong> {Math.ceil(combinedSchedule.length / course.selectedDays.length)} weeks</div>
            <div><strong>Teaching Days:</strong> {combinedSchedule.length}</div>
            <div><strong>Selected Days:</strong> {course.selectedDays.join(', ')}</div>
            <div><strong>Excluded Dates:</strong> {course.excludedDates.length}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Week</th>
                <th>Date</th>
                <th>Topic</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedSchedule).map(([weekNumber, dates]) => (
                <React.Fragment key={weekNumber}>
                  <tr>
                    <td rowSpan={dates.length}>{weekNumber}</td>
                    <td>{dates[0]}</td>
                    <td>{notes[dates[0]]?.join(', ') || ''}</td>
                  </tr>
                  {dates.slice(1).map(date => (
                    <tr key={date}>
                      <td>{date}</td>
                      <td>{notes[date]?.join(', ') || ''}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
    </Container>
  );
};