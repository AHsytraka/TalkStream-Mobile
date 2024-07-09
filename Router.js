import { createRouter, Route } from 'expo-router';

const Router = createRouter(() => (
  <Route path="/search/searchResult/:username" component={SearchResultScreen} />
));