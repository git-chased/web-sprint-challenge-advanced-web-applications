import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {  navigate('/login')}
  const redirectToArticles = () => { navigate('/articles')}

  const logout = () => {
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = async ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
    redirectToArticles()
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: localStorage.getItem('token')},
        body: JSON.stringify({username, password})
      })
      const data = await response.json()

      if(response.ok){
        localStorage.setItem('token', data.token)
        setMessage(data.message)
      } else if 
        (response.status === 401){
          logout()
      }
      else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('Login Failed')
    } finally {setSpinnerOn(false)}
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = async () => {
    setMessage('');
    setSpinnerOn(true)
    try {
      const response = await fetch(articlesURL, {
        headers: {Authorization: localStorage.getItem('token')}
      })
      const data = await response.json()

      if (response.ok) {
        setArticles(data)
        setMessage(data.message)
      } else {
        setMessage('Failed to retrieve articles')
      }
    } catch (error) {
      setMessage('Failed to retrieve articles')
    } finally {
      setSpinnerOn(false)
    }
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = async (article) => {
    setMessage('');
    setSpinnerOn(true)
    try {
      const response = await fetch(articlesURL, {
        method: 'POST',
        headers: {'Content-Type': 'aplication/json', Authorization: localStorage.getItem('token')},
        body: JSON.stringify(article)
      })
      const data = await response.json()
      if (response.ok) {
        setArticles([...articles, data])
        setMessage(data.message)
      } else {
        setMessage('Failed to retrieve articles')
      }
    } catch (error) {
      setMessage('Failed to post article')
    } finally {
      setSpinnerOn(false)
    }
    
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = async ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage('');
    setSpinnerOn(true)
    try {
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'aplication/json', Authorization: localStorage.getItem('token')},
        body: JSON.stringify(article)
      })
      const data = await response.json()

      if (response.ok) {
        setArticles(articles.map((art) => (art.article_id === article_id ? data.article : art)))
        setMessage(data.message)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error occured updating') // Need to check what error messages show under, error.message or data.error
    } finally {
      setSpinnerOn(false)
    }
  }

  const deleteArticle = async (article_id) => {
    // ✨ implement
    setMessage('');
    setSpinnerOn(true)
    try {
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      const data = await response.json()
      if (response.ok){
        setArticles(articles.filter((art) => art.article_id !== article_id))
        setMessage(data.message)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error deleting occured')
    } finally {
      setSpinnerOn(false)
    }
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn={spinnerOn} />
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
              />
              <Articles 
                articles={articles}
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
