'use client';

import { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

const initialState = {
  user: null,
  userName: '',
  posts: [],
  startDate: null,
  endDate: null,
  loading: true,
  error: '',
  animatingPosts: {},
};

const PostContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, userName: action.payload.userName };
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false, error: '' };
    case 'SET_DATES':
      return { ...state, ...action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'REMOVE_POST':
      return { ...state, posts: state.posts.filter((post) => post.id !== action.payload) };
    case 'PIN_POST':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? { ...post, pinned: true, color: action.payload.color } : post
        ).sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1)),
      };
    case 'UNPIN_POST':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? { ...post, pinned: false, color: action.payload.color } : post
        ).sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1)),
      };
    case 'REORDER_POSTS':
      const { payload: postId, pinned } = action;
      const updatedPosts = state.posts.map((post) =>
        post.id === postId ? { ...post, pinned } : post
      );
      updatedPosts.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));
      return { ...state, posts: updatedPosts };
    case 'UPDATE_POST_COLOR':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? { ...post, color: action.payload.color }
            : post
        ),
      };
    case 'EDIT_POST':
      return state;
    default:
      return state;
  }
}

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const apiCall = async (method, url, data = null) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios({ method, url, data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addPost = async (title, content) => {
    const response = await apiCall('POST', '/api/currentUserPosts', { title, content });
    if (response && response.success) {
      dispatch({ type: 'ADD_POST', payload: response.data });
    } else if (response) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add the post. Please try again.' });
    }
  };

  const deletePost = async (postId) => {
    const response = await apiCall('DELETE', `/api/currentUserPosts/${postId}`);
    if (response && response.success) {
      dispatch({ type: 'REMOVE_POST', payload: postId });
    } else if (response) {
      dispatch({ type: 'SET_ERROR', payload: response.message });
    }
  };

  const updatePostColor = async (postId, color) => {
    const response = await apiCall('PATCH', `/api/currentUserPosts/${postId}`, { color });
    if (response) {
      dispatch({ type: 'UPDATE_POST_COLOR', payload: { postId, color } });
    } else {
      dispatch({ type: 'SET_ERROR', payload: response.message });
    }
  };

  const pinPost = async (postId) => {
    const response = await apiCall('PATCH', `/api/currentUserPosts/${postId}`, { pinned: true });
    if (response) {
      dispatch({ type: 'PIN_POST', payload: response });
    }
  };

  const unpinPost = async (postId) => {
    const response = await apiCall('PATCH', `/api/currentUserPosts/${postId}`, { pinned: false });
    if (response) {
      dispatch({ type: 'UNPIN_POST', payload: response });
    }
  };

  return (
    <PostContext.Provider value={{ state, dispatch, addPost, deletePost, updatePostColor, pinPost, unpinPost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
