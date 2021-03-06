import {
  Admin,
  Dashboard,
  resolveBrowserLocale,
  Resource,
} from 'admin-on-rest';
import frenchMessages from 'aor-language-french';
import React from 'react';

import authClient from '../../http/authClient';
import restClient from '../../http/restClient';
import {
  fetchAndFormatSwaggerJson,
  formCreateFactory,
  formEditFactory,
  listFactory,
  SwaggerAorOptions,
} from '../../swaggerToAor';

interface AppState {
  swaggerJson: SwaggerAorOptions[];
}

const messages = {
  fr: {
    ...frenchMessages,
    title: 'Tableau de bord',
  },
};

const Title = () => (
  <span>
    {messages[resolveBrowserLocale()]
      ? messages[resolveBrowserLocale()].title
      : 'nest boilerplate dashboard'}
  </span>
);

class App extends React.PureComponent<{}, AppState> {
  public state = {
    swaggerJson: [] as SwaggerAorOptions[],
  };

  public async componentDidMount() {
    if (this.state.swaggerJson.length === 0) {
      const swaggerJson = await fetchAndFormatSwaggerJson();
      this.setState({ swaggerJson });
    }
  }

  public render() {
    return (
      <React.Fragment>
        {this.state.swaggerJson.length > 0 && (
          <Admin
            title={<Title />}
            authClient={authClient}
            dashboard={Dashboard}
            locale={this.getLocale()}
            messages={messages}
            restClient={restClient(process.env.API_PATH as string)}
          >
            {this.state.swaggerJson.map((entity, index) => (
              <Resource
                key={index}
                name={entity.name}
                list={
                  entity.endpoints.includes('get') ? listFactory(entity) : null
                }
                create={
                  entity.endpoints.includes('post')
                    ? formCreateFactory(entity)
                    : null
                }
                edit={
                  entity.endpoints.includes('put')
                    ? formEditFactory(entity)
                    : null
                }
              />
            ))}
          </Admin>
        )}
      </React.Fragment>
    );
  }

  private getLocale() {
    const browserLocale = resolveBrowserLocale();
    const supportedLocales = Array.from(process.env
      .SUPPORTED_LANGUAGES as string);

    return supportedLocales.includes(browserLocale)
      ? browserLocale
      : (process.env.DEFAULT_LOCALE as string);
  }
}

export default App;
