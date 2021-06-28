import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled, { createGlobalStyle } from 'styled-components'

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import './utils/i18next';

import Person from './pages/Person';

const GlobalStyles = createGlobalStyle`

/* latin-ext */
@font-face {
  font-family: 'Titillium Web';
  font-style: normal;
  font-weight: 200;
  font-display: swap;
  src: local('Titillium Web ExtraLight'), local('TitilliumWeb-ExtraLight'), url(https://fonts.gstatic.com/s/titilliumweb/v7/NaPDcZTIAOhVxoMyOr9n_E7ffAzHGIVzY4SY.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Titillium Web';
  font-style: normal;
  font-weight: 200;
  font-display: swap;
  src: local('Titillium Web ExtraLight'), local('TitilliumWeb-ExtraLight'), url(https://fonts.gstatic.com/s/titilliumweb/v7/NaPDcZTIAOhVxoMyOr9n_E7ffAzHGItzYw.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* latin-ext */
@font-face {
  font-family: 'Titillium Web';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Titillium Web Regular'), local('TitilliumWeb-Regular'), url(https://fonts.gstatic.com/s/titilliumweb/v7/NaPecZTIAOhVxoMyOr9n_E7fdM3mDbRS.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Titillium Web';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Titillium Web Regular'), local('TitilliumWeb-Regular'), url(https://fonts.gstatic.com/s/titilliumweb/v7/NaPecZTIAOhVxoMyOr9n_E7fdMPmDQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* latin-ext */
@font-face {
  font-family: 'Titillium Web';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: local('Titillium Web SemiBold'), local('TitilliumWeb-SemiBold'), url(https://fonts.gstatic.com/s/titilliumweb/v7/NaPDcZTIAOhVxoMyOr9n_E7ffBzCGIVzY4SY.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Titillium Web';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: local('Titillium Web SemiBold'), local('TitilliumWeb-SemiBold'), url(https://fonts.gstatic.com/s/titilliumweb/v7/NaPDcZTIAOhVxoMyOr9n_E7ffBzCGItzYw.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}



* {
  box-sizing: border-box;
  font-family: 'Titillium Web', sans-serif;
}

pre {
  font-family: 'Share Tech Mono', monospace;
}

.leaflet-container {
  height: 100%;
  width: 100%;
}
`;

const Page = styled.div`
  width: 900px;
  margin: 0 auto;
  background-color: #ddd;
  padding: 20px;
`;

const App = () => {

  const client = new ApolloClient({
    uri: "/graphql"
  });

  return (
    <ApolloProvider client={client}>
      <GlobalStyles />
      <Page>
        <Router>
          <Switch>
            <Route path="/person/:id" render={({match: {params: {id}}}) => <Person id={id} />} />
            <Route render={() => <Person id="e14da37bd29890662d5e06b599" />} />
          </Switch>
        </Router>
      </Page>
    </ApolloProvider>
  );
}

render(<App />, document.querySelector('#container'));
