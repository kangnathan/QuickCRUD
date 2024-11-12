const styles = {
    dialog: {
        borderRadius: '20px',
        width: '75%',
        height: 'auto',
        p: 2,
        textAlign: 'center',
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
    postButton: {
        backgroundColor: '#BB86FC',
        color: 'white',
        borderRadius: 1,
        p: '8px 25px',
        fontWeight: 'bold',
        marginRight: '20px',
    },
    textFieldRoot: {
        '& .MuiOutlinedInput-root': {
            '& textarea': {
                padding: '10px',
            },
        },
    },
}

export default styles
