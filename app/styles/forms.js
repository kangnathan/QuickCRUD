export const textFieldStyles = {
  borderRadius: "5%",
  backgroundColor: "#F0F0F0",
  "& .MuiInputBase-input": { color: "#050505" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FF0000" }, 
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