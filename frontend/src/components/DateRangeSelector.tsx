import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { Container, Paper, Typography, Box, Grid, TextField, Alert } from '@mui/material';

interface DateRangeSelectorProps {
  course: Course;
  onUpdate: (course: Course) => void;
  onValidate: (isValid: boolean) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ course, onUpdate, onValidate }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [startDateTouched, setStartDateTouched] = useState(false);
  const [endDateTouched, setEndDateTouched] = useState(false);

  useEffect(() => {
    if (startDateTouched && endDateTouched) {
      const isValid = new Date(course.startDate) <= new Date(course.endDate);
      setShowPopup(!isValid);
      onValidate(isValid);
    }
  }, [course.startDate, course.endDate, startDateTouched, endDateTouched, onValidate]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDateTouched(true);
    const newStartDate = e.target.value;
    onUpdate({ ...course, startDate: newStartDate });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDateTouched(true);
    const newEndDate = e.target.value;
    onUpdate({ ...course, endDate: newEndDate });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#e3f2fd' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1565c0' }}>
          Select Date Range
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={course.startDate || ''}
                onChange={handleStartDateChange}
                InputLabelProps={{ shrink: true, style: { fontFamily: 'Arial, sans-serif', color: '#1565c0' } }}
                InputProps={{ style: { fontFamily: 'Arial, sans-serif', color: '#1565c0' } }}
                sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#1565c0' }, '&:hover fieldset': { borderColor: '#1e88e5' }, '&.Mui-focused fieldset': { borderColor: '#42a5f5' } } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={course.endDate || ''}
                onChange={handleEndDateChange}
                InputLabelProps={{ shrink: true, style: { fontFamily: 'Arial, sans-serif', color: '#1565c0' } }}
                InputProps={{ style: { fontFamily: 'Arial, sans-serif', color: '#1565c0' } }}
                sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#1565c0' }, '&:hover fieldset': { borderColor: '#1e88e5' }, '&.Mui-focused fieldset': { borderColor: '#42a5f5' } } }}
              />
            </Grid>
          </Grid>
        </Box>
        {showPopup && (
          <Alert severity="error" sx={{ mt: 4 }}>
            End date cannot be before the start date. Please select a valid date range.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};