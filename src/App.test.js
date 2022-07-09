import { render, screen, waitForElementToBeRemoved, act } from '@testing-library/react';
import App from './App';
import userEvent from "@testing-library/user-event"
import { getHeroDetail } from "./api"

jest.mock('./api')

const SUPERMAN = {
  id: 1,
  name: 'Superman',
  avatar: 'https://cdn.theatlantic.com/thumbor/xuePShEYRyEQec_THgWcYFhYLnw=/540x0:2340x1800/500x500/media/img/mt/2016/01/superman/original.jpg',
  description: 'Superman is a fictional superhero. The character was created by writer Jerry Siegel and artist Joe Shuster, and first appeared in the comic book Action Comics #1 (cover-dated June 1938 and published April 18, 1938).[1] The character regularly appears in comic books published by DC Comics, and has been adapted to a number of radio serials, movies, and television shows.',
};

getHeroDetail.mockResolvedValue(SUPERMAN)

const renderApp = () => {
  render(<App />)
  const getInput = () => screen.getByLabelText(/search/i)
  const getSubmit = () => screen.getByRole('button', { name: /submit/i })

  const runSearchJourney = async (name, pandingCallback) => {
    userEvent.type(getInput(), name)
    userEvent.click(getSubmit())
    if (pandingCallback) pandingCallback()
    await waitForElementToBeRemoved(() => screen.getByText('loading'))
  }

  return {
    getInput,
    getSubmit,
    runSearchJourney
  }
}

describe('App', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display input & submit button', () => {

    const { getInput, getSubmit } = renderApp()

    getInput()
    getSubmit()

  })

  it('should call "getHeroDetail" with name when submitted', async () => {
    const { runSearchJourney } = renderApp()

    await runSearchJourney('superman')

    expect(getHeroDetail).toHaveBeenCalledWith('superman')
  })

  it('should loading ', async () => {
    const { runSearchJourney } = renderApp()

    await runSearchJourney('superman', () => {
      screen.getByText('loading')
    })

    expect(getHeroDetail).toHaveBeenCalledWith('superman')


  })

  it('should loaded and render page. ', async () => {
    const { runSearchJourney } = renderApp()

    await runSearchJourney('superman', () => {
      screen.getByText(SUPERMAN.name)
      screen.getByText(SUPERMAN.description)
      screen.getByAltText(`Avatar of ${SUPERMAN.name}`)
    })


  })

})


