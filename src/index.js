import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RecoilRoot, atom } from 'recoil';
import { RouterProvider, createBrowserRouter, useSearchParams } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import KakaoCallBackPage from './pages/KakaoCallBackPage';
import HomePage from './pages/HomePage';
import DeactivatePage from './pages/settings/DeactivatePage';
import ProfilePage from './pages/settings/ProfilePage';

export const jwtState = atom(
  {
    key : "jwtState",
    default :null
  }
)
export const userEmailState= atom(
  
    { key: "userEmailState", default: null }
  
)
const router = createBrowserRouter([
  {
    path : "/" , element : <IndexPage/>
  },
  {
    path : "/flow/login" , element :<LoginPage/>,
  },
  {
    path : "/flow/signup" , element : <SignUpPage/>
  },
  {
    path: "/flow/kakao/callback", element: <KakaoCallBackPage /> 
 },
 {
    path: "/home" ,element:<HomePage/>
 },
 {
    path: "/settings/profile" , element: <ProfilePage/>
 },
 {
    path: "/settings/deactivate" ,element:<DeactivatePage/>
 }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <RouterProvider router={router}/>
  </RecoilRoot>
);

