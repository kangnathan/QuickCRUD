export const containerStyles = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 1,
}

export const datePickerContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  flexGrow: 1,
  marginRight: '15px',
}

export const datePickerBoxStyles = {
  flex: 1,
}

export const datePickerTextFieldStyles = {
  width: '100%',
  '& .MuiInputBase-input': { color: 'black' },
  '& .MuiInputLabel-root': { color: 'black' },
  '& .MuiOutlinedInput-root': {
    border: '1px solid black',
    borderRadius: '25px',
  },
  '& .MuiSvgIcon-root': { color: 'black' },
  '& .MuiInputBase-root': { backgroundColor: 'white' },
}

export const buttonContainerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

export const clearButtonStyles = {
  backgroundColor: 'white',
  color: 'black',
  borderRadius: 20,
  textTransform: 'none',
  padding: '10px 15px',
  minWidth: '100px',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}

export const newButtonStyles = {
  backgroundColor: 'white',
  color: 'black',
  borderRadius: 20,
  textTransform: 'none',
  padding: '10px 15px',
  minWidth: '100px',
  marginLeft: '15px',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}

export const textFieldStyles = {
  borderRadius: '5%',
  backgroundColor: '#F0F0F0',
  '& .MuiInputBase-input': { color: '#050505' },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#F0F0F0' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#F0F0F0' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F0F0F0' },
}

export const buttonStyles = {
  backgroundColor: '#BB86FC',
  color: 'white',
  '&:hover': {
    backgroundColor: '#9b4bce',
  },
  '&.Mui-disabled': {
    backgroundColor: '#D3D3D3',
    color: '#4847b5',
  },
}
