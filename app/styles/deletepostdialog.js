const styles = {
  dialog: {
    borderRadius: '20px',
    width: '18.5%',
    p: 2,
    textAlign: 'center',
  },
  dialogTitle: {
    fontWeight: 'bold',
  },
  dialogActions: {
    justifyContent: 'center',
  },
  cancelButton: {
    mr: 2,
    fontWeight: 'bold',
    borderRadius: 1,
    p: '8px 25px',
    color: 'black',
    borderColor: 'black',
    '&:hover': {
      borderColor: 'black',
      color: 'black',
    },
  },
  confirmButton: {
    backgroundColor: '#FF4F4F',
    color: 'white',
    borderRadius: 1,
    p: '8px 45px',
    fontWeight: 'bold',
  },
}

export default styles
