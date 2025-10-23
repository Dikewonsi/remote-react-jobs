import React from 'react'
import Cliploader from 'react-spinners/ClipLoader'

const override = {
    display: 'block',
    margin: '100px auto',
}

const Spinner = ({loading}) => {
  return (
    <Cliploader 
        color='#4338ca'
        loading={loading}
        cssoverride={override}
        size={150}
    />
  )
}

export default Spinner