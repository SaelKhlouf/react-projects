import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
//import StarRating from './StarRating.jsx'

createRoot(document.getElementById('root')).render(

    <App /> 
    /* <StarRating maxRating={10} /> */

)
