import React from "react";
import {render} from '@testing-library/react'
import '@testing-library/jest-dom' 
import Spinner from "./Spinner";

describe('Spinner Component', () => {
  test('spinner shows when true', () => {
    const {getByText} = render(<Spinner spinnerOn={true}/>)
    const spinnerElement = getByText('Please wait...')
    expect(spinnerElement).toBeInTheDocument()
  })

  test('spinner does not show when false', () => {
    const {queryByText} = render(<Spinner spinnerOn={false}/>)
    const spinnerElement = queryByText('Please wait...')
    expect(spinnerElement).not.toBeInTheDocument()
  })
})