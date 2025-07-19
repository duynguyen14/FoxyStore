import { useState } from 'react'
import Home from './pages/Admin'
import { PublicPage } from './pages'
import OAuthRedirect from './untils/OAuthRedirect';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ScrollToTop from './components/OtherComponent/ScrollToTop'
function App() {
  return (
    <Router>
      <div>
      <ScrollToTop/>
      {/* <ToastContainer
      /> */}
        <Routes>
          {
            PublicPage.map((page,index)=>{
              const Page =page.component;
              const Layout =page.layout;
              if(Layout==null){
                return(
                  <Route
                  key={index} path={page.path} element={<Page/>}
                  />
                )
              }
              else{
                return(
                  <Route
                  key={index} path={page.path} element={
                    <Layout>
                        <Page/>
                    </Layout>
                  } 
                  />
                )
              }
            })
          }
        </Routes>
      </div>
    </Router>
  )
}
export default App
