import React from 'react'
import { Input } from '@/components/ui/input'
import { mount } from 'cypress/react18'

describe('Input Component', () => {
  it('renders correctly', () => {
    mount(<Input placeholder="Enter text" />)
    cy.get('input').should('exist')
  })

  it('accepts input', () => {
    mount(<Input />)
    cy.get('input').type('Hello, World!').should('have.value', 'Hello, World!')
  })

  it('applies custom className', () => {
    mount(<Input className="custom-class" />)
    cy.get('input').should('have.class', 'custom-class')
  })

  it('handles different input types', () => {
    mount(<Input type="password" />)
    cy.get('input').should('have.attr', 'type', 'password')
  })

  it('supports data-testid attribute', () => {
    mount(<Input data-testid="test-input" />)
    cy.get('[data-testid="test-input"]').should('exist')
  })

  it('handles disabled state', () => {
    mount(<Input disabled />)
    cy.get('input').should('be.disabled')
  })
})