import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker'
import { Box, TextField, Button } from '@mui/material'
import { useState } from 'react'
import AddPostModal from './AddPostModal'
import { usePostContext } from '@/app/context/PostContext'
import {
  containerStyles,
  datePickerContainerStyles,
  datePickerBoxStyles,
  datePickerTextFieldStyles,
  buttonContainerStyles,
  clearButtonStyles,
  newButtonStyles,
} from '../app/styles/datepicker'

export default function DatePicker({ fetchPosts }) {
  const { state, dispatch } = usePostContext()
  const { startDate, endDate } = state
  const [open, setOpen] = useState(false)

  const handleDateChange = (type) => (newValue) => {
    dispatch({ type: 'SET_DATES', payload: { ...state, [type]: newValue } })
  }

  const handleClearFilters = () => {
    dispatch({ type: 'SET_DATES', payload: { startDate: null, endDate: null } })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={containerStyles}>
        <Box sx={datePickerContainerStyles}>
          <Box sx={datePickerBoxStyles}>
            <MUIDatePicker
              label="Start Date"
              value={startDate ?? null}
              onChange={handleDateChange('startDate')}
              slots={{
                textField: (params) => (
                  <TextField {...params} sx={datePickerTextFieldStyles} />
                ),
              }}
            />
          </Box>
          <Box sx={datePickerBoxStyles}>
            <MUIDatePicker
              label="End Date"
              value={endDate ?? null}
              onChange={handleDateChange('endDate')}
              slots={{
                textField: (params) => (
                  <TextField {...params} sx={datePickerTextFieldStyles} />
                ),
              }}
            />
          </Box>
        </Box>
        <Box sx={buttonContainerStyles}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClearFilters}
            sx={clearButtonStyles}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={newButtonStyles}
          >
            New
          </Button>
        </Box>
      </Box>
      <AddPostModal open={open} onClose={() => setOpen(false)} refetchPosts={fetchPosts} />
    </LocalizationProvider>
  )
}
