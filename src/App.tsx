
import { FormEvent, useState } from 'react';
import './App.css';
import { Tooltip } from './components/tooltip';
import axios from 'axios'

interface ParamsForApiRoute {
  ticker: string
  passedCriteriaExample: string,
  infoToRemove: string
}

function App() {
  // Component state
  // To be used to request stock price from backend
  const [ticker, setTicker] = useState('');
  // Stock price retrieved
  const [tickerPrice, setTickerPrice] = useState<number>();
  // To hold input text after removal of quotation mark (") characters from text
  const [unquotedText, setUnquotedText] = useState('');

  // Function to handle form submition
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // Preventing the defautl behavior of form submition event
    e.preventDefault()

    // Query params to include the following data. Ticker parameter to be forwarded by proxy server to target API
    let params: ParamsForApiRoute = { ticker, passedCriteriaExample: 'success', infoToRemove: 'remove' }
    axios.get('http://192.168.1.101:5000/api', { params })
      .then(response => {
        // On successful retrieval of data, to update the state of the component
        setTickerPrice(response.data.price)
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <div className="App">
      <div className='justify-self-center flex flex-col'>
        <div className='title text-white'>Request to server:</div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label className='block text-left text-white'>Ticker: </label>
          <input
            title='ticker'
            placeholder='Enter ticker symbol'
            required
            type='text'
            value={ticker}
            className='w-full mt-[1%] mb-[1%] p-[1%] text-black rounded-md'
            onChange={(e) => setTicker(e.currentTarget.value)} // Controlled input
          />
          {/* React Tooltip component such that given any target element in a page, it will render a tooltip panel relative to the target element */}
          <Tooltip position={'right'} content={'Click to retrieve ticker stock price'} >
            <button className={`bg-green-600 ${tickerPrice ? 'mb-[1%]' : 'mb-[5%]'} text-white`} type='submit'>Get Ticker Price</button>
          </Tooltip>
        </form>
        {tickerPrice ? <div className='mb-[4%] mx-[35%] bg-green-100'>{ticker.toUpperCase()} Price: ${tickerPrice}</div> : null}

        <div className='bg-slate-400 p-[1%]'>
          <div className='title mb-[1%]'>Tooltip Demo:</div>
          <div className='flex flex-wrap w-full justify-evenly border-b-4 border-b-black '>
            {/* Tooltip omponent includes control over what triggers it to open/close (trigger) */}
            <Tooltip position={'top'} content={'primary theme'} trigger='click'>
              <button className='bg-green-300' type='button'>Top (Click)</button>
            </Tooltip>
            {/* Tooltip omponent includes control over where the tooltip panel is positioned (position)*/}
            <Tooltip position={'left'} content={'danger theme'} variant='danger'>
              <button className='bg-green-400' type='button'>Left (Hover)</button>
            </Tooltip>
            {/* Tooltip omponent includes control over the theme of the tooltip (variant) */}
            <Tooltip position={'right'} content={'success theme'} variant='success'>
              <button className='bg-green-500' type='button'>Right (Hover)</button>
            </Tooltip>
            <Tooltip position={'bottom'} content={'primary theme'} >
              <button className='bg-green-600 text-white' type='button'>Bottom (Hover)</button>
            </Tooltip>
          </div>
          <div className='title mt-[1%]'>Quotes Demo:</div>
          <label className='block text-left'>Quoted Text: </label>
          <textarea
            title='quoted text'
            placeholder='Enter quoted text'
            className='w-[50%] mt-[2%] mb-[2%] p-[1%] text-black rounded-md'
            onChange={(e) => setUnquotedText(e.currentTarget.value.replaceAll('"', ''))} // Strips quote characters from a string
          />
          <label className='block text-left'>Unquoted Text: </label>
          <div>{unquotedText}</div>
        </div>
      </div>
    </div >
  );
}

export default App;
