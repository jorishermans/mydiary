import { ss } from '@storagestack/core'
import React, { useState } from 'react'
import './App.css'
import AuthLayout from './components/auth/AuthLayout';
import useSearchMiddleware from './components/auth/useSearchMiddleware';
import useMiddleware from './components/auth/useMiddleware';

function App() {
  // ss.clear();
  ss.setDebugging(true);
  useSearchMiddleware();
  useMiddleware();
  //
  return (
    <div className="App">
      <AuthLayout></AuthLayout>
    </div>
  )
}

export default App
