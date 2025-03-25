import React from 'react';
import { Course } from '../types';
import { TextField, Container, Typography, Box, Grid, Paper } from '@mui/material';

interface CourseFormProps {
  course: Course;
  onUpdate: (course: Course) => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({ course, onUpdate }) => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#e3f2fd' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1565c0' }}>
          Course Details
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Name"
                variant="outlined"
                value={course.name}
                onChange={(e) => onUpdate({ ...course, name: e.target.value })}
                margin="normal"
                InputLabelProps={{ style: { fontFamily: 'Arial, sans-serif', color: '#1565c0' } }}
                InputProps={{ style: { fontFamily: 'Arial, sans-serif', color: '#1565c0' } }}
                sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#1565c0' }, '&:hover fieldset': { borderColor: '#1e88e5' }, '&.Mui-focused fieldset': { borderColor: '#42a5f5' } } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Code"
                variant="outlined"
                value={course.code}
                onChange={(e) => onUpdate({ ...course, code: e.target.value })}
                margin="normal"
                InputLabelProps={{ style: { fontFamily: 'Arial, sans-serif', color: '#1565c0' } }}
                InputProps={{ style: { fontFamily: 'Arial, sans-serif', color: '#1565c0' } }}
                sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#1565c0' }, '&:hover fieldset': { borderColor: '#1e88e5' }, '&.Mui-focused fieldset': { borderColor: '#42a5f5' } } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                variant="outlined"
                value={course.notes}
                onChange={(e) => onUpdate({ ...course, notes: e.target.value })}
                margin="normal"
                multiline
                rows={4}
                InputLabelProps={{ style: { fontFamily: 'Arial, sans-serif', color: '#1565c0' } }}
                InputProps={{ style: { fontFamily: 'Arial, sans-serif', color: '#1565c0' } }}
                sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#1565c0' }, '&:hover fieldset': { borderColor: '#1e88e5' }, '&.Mui-focused fieldset': { borderColor: '#42a5f5' } } }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};