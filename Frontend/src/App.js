// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import {Outlet} from 'react-router-dom'
// import PrivateRoute from './components/Routing/PrivateRoute';
// import Home from "./components/GeneralScreens/Home"
// import LoginScreen from "./components/AuthScreens/LoginScreen"
// import RegisterScreen from "./components/AuthScreens/RegisterScreen"
// import ForgotPasswordScreen from "./components/AuthScreens/ForgotPasswordScreen"
// import ResetPasswordScreen from "./components/AuthScreens/ResetPasswordScreen"
// import AddStory from './components/StoryScreens/AddStory';
// import DetailStory from './components/StoryScreens/DetailStory';
// import Header from './components/GeneralScreens/Header';
// import Profile from './components/ProfileScreens/Profile';
// import EditProfile from './components/ProfileScreens/EditProfile';
// import ChangePassword from './components/ProfileScreens/ChangePassword';
// import NotFound from './components/GeneralScreens/NotFound';
// import EditStory from './components/StoryScreens/EditStory';
// import ReadListPage from './components/ProfileScreens/ReadListPage';

// const App = () => {

//       return (
//             <Router>

//                   <div className="App">

//                         <Routes>
//                               <Route path="/" element={<LayoutsWithHeader />}>

//                                     <Route path='*' element={<NotFound />} />

//                                     <Route exact path='/' element={<PrivateRoute />}>
//                                           <Route exact path='/' element={<Home />} />
//                                     </Route>

//                                     <Route exact path="/story/:slug" element={<DetailStory />} />

//                                     <Route exact path='/addstory' element={<PrivateRoute />}>
//                                           <Route exact path='/addstory' element={<AddStory />} />
//                                     </Route>

//                                     <Route exact path='/profile' element={<PrivateRoute />}>
//                                           <Route exact path='/profile' element={<Profile />} />
//                                     </Route>

//                                     <Route exact path='/edit_profile' element={<PrivateRoute />}>
//                                           <Route exact path='/edit_profile' element={<EditProfile />} />
//                                     </Route>

//                                     <Route exact path='/change_Password' element={<PrivateRoute />}>
//                                           <Route exact path='/change_Password' element={<ChangePassword />} />
//                                     </Route>

//                                     <Route exact path='/story/:slug/like' element={<PrivateRoute />}>
//                                           <Route exact path='/story/:slug/like' element={<DetailStory />} />
//                                     </Route>

//                                     <Route exact path='/story/:slug/edit' element={<PrivateRoute />}>
//                                           <Route exact path='/story/:slug/edit' element={<EditStory />} />
//                                     </Route>

//                                     <Route exact path='/story/:slug/delete' element={<PrivateRoute />}>
//                                           <Route exact path='/story/:slug/delete' element={<DetailStory />} />
//                                     </Route>
//                                     <Route exact path='/story/:slug/addComment' element={<PrivateRoute />}>
//                                           <Route exact path='/story/:slug/addComment' element={<DetailStory />} />
//                                     </Route>
                                   
//                                     <Route exact path='/readList' element={<PrivateRoute />}>
//                                           <Route exact path='/readList' element={<ReadListPage />} />
//                                     </Route>

//                               </Route>

//                               <Route exact path="/login" element={<LoginScreen />} />
//                               <Route exact path="/register" element={<RegisterScreen />} />

//                               <Route exact path="/forgotpassword" element={<ForgotPasswordScreen />} />

//                               <Route exact path="/resetpassword" element={<ResetPasswordScreen />} />


//                         </Routes>

//                   </div>

//             </Router>

//       );

// }

// const LayoutsWithHeader =() => {
//       return (
//             <>
//                   <Header />
//                   <Outlet />
//             </>
//       );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import AuthContextProvider from './Context/AuthContext';
import PrivateRoute from './components/Routing/PrivateRoute';
import Home from "./components/GeneralScreens/Home";
import LoginScreen from "./components/AuthScreens/LoginScreen";
import RegisterScreen from "./components/AuthScreens/RegisterScreen";
import ForgotPasswordScreen from "./components/AuthScreens/ForgotPasswordScreen";
import ResetPasswordScreen from "./components/AuthScreens/ResetPasswordScreen";
import AddStory from './components/StoryScreens/AddStory';
import DetailStory from './components/StoryScreens/DetailStory';
import Header from './components/GeneralScreens/Header';
import Profile from './components/ProfileScreens/Profile';
import EditProfile from './components/ProfileScreens/EditProfile';
import ChangePassword from './components/ProfileScreens/ChangePassword';
import NotFound from './components/GeneralScreens/NotFound';
import EditStory from './components/StoryScreens/EditStory';
import ReadListPage from './components/ProfileScreens/ReadListPage';

const App = () => {
    return (
        <AuthContextProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Routes with Header Layout */}
                        <Route path="/" element={<LayoutsWithHeader />}>
                            {/* Protected Routes */}
                            <Route element={<PrivateRoute />}>
                                <Route index element={<Home />} />
                                <Route path="addstory" element={<AddStory />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="edit_profile" element={<EditProfile />} />
                                <Route path="change_Password" element={<ChangePassword />} />
                                <Route path="readList" element={<ReadListPage />} />
                                <Route path="story/:slug/edit" element={<EditStory />} />
                            </Route>
                            
                            {/* Public Story Detail Route - NO LEADING SLASH */}
                            <Route path="story/:slug" element={<DetailStory />} />
                            
                            {/* 404 Route - MUST be last */}
                            <Route path="*" element={<NotFound />} />
                        </Route>

                        {/* Auth Routes (No Header) */}
                        <Route path="/login" element={<LoginScreen />} />
                        <Route path="/register" element={<RegisterScreen />} />
                        <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
                        <Route path="/resetpassword" element={<ResetPasswordScreen />} />
                    </Routes>
                </div>
            </Router>
        </AuthContextProvider>
    );
};

const LayoutsWithHeader = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default App;
