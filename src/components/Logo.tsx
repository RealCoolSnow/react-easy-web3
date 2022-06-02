import React from 'react'
import logo from '@/assets/logo.png'

export default class Logo extends React.Component {
  render() {
    return <img src={logo} className='w-10 rounded-full' alt='logo' />
  }
}
