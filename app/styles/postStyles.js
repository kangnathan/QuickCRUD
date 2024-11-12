const postStyles = {
  paper: (bgColor) => ({
    borderRadius: '3%',
    padding: '24px',
    cursor: 'pointer',
    position: 'relative',
    minHeight: '300px',
    maxHeight: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'pre-wrap',
    backgroundColor: bgColor,
    '&:hover .color-icon, &:hover .more-icon': {
      opacity: 1,
    },
  }),
  title: {
    wordBreak: 'break-word',
    color: 'white',
  },
  content: (post) => ({
    mt: 1,
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    paddingBottom: '40px',
    color: post.content ? 'white' : 'text.disabled',
  }),
  pinIcon: (isPinned) => ({
    color: isPinned ? '#FFC107' : 'gray',
    position: 'absolute',
    top: 8,
    right: 8,
    transition: 'color 0.3s ease-in-out',
    '&:hover': {
      color: '#FFC107',
    },
  }),
  colorIcon: {
    position: 'absolute',
    bottom: 8,
    right: 40,
    color: 'gray',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  moreIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    color: 'gray',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  colorPopover: {
    padding: '10px',
  },
  colorPicker: (color) => ({
    width: '30px',
    height: '30px',
    backgroundColor: color,
    borderRadius: '50%',
    cursor: 'pointer',
  }),
}

export default postStyles
