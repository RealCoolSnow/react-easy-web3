import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from '@/router'
import '@/locale'
import './App.css'
import { Header, Footer } from '@/components/Layout'

const App = () => {
  return (
    <div className="App">
      <div className="wrapper">
        <header>
          <Header />
        </header>
        <main>
          <BrowserRouter>
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
            </Routes>
          </BrowserRouter>
        </main>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default App
