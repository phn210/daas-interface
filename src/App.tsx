import { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes, { RouteConfig } from './configs/routes';
import { Layouts, LayoutType } from './layouts';

function App() {
  const filterRoutesAndPathsByLayout = (layout: LayoutType) => {
    const layoutRoutes = [] as RouteConfig[];
    const layoutPaths = [] as string[];

    if (routes) {
      routes.forEach((route) => {
        if (
          !(process.env.NODE_ENV === 'production' && route.disableInProduction) &&
          !route.redirect &&
          route.layout === layout
        ) {
          layoutRoutes.push(route);
          layoutPaths.push(route.path);
        }
      });
    }

    return { layoutRoutes, layoutPaths };
  };

  const filterRedirectRoutes = () => {
    let redirectRoutes = [] as RouteConfig[];
    if (routes) {
      redirectRoutes = routes.filter(
        (route) => !(process.env.NODE_ENV === 'production' && route.disableInProduction) && route.redirect
      );
    }

    return redirectRoutes;
  };

  const redirectRoutes = filterRedirectRoutes();

  return (
    <Switch>
      {Object.keys(Layouts).map((layout: string, idx) => {
        const LayoutTag = Layouts[layout];
        const { layoutRoutes, layoutPaths } = filterRoutesAndPathsByLayout(layout as LayoutType);

        return (
          <Route key={idx} path={[...layoutPaths]}>
            <LayoutTag>
              <Switch>
                {layoutRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === true}
                    render={(props) => {
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      const Component = route.component!;
                      return (
                        <Suspense fallback={null}>
                          <Component {...props} />
                        </Suspense>
                      );
                    }}
                  />
                ))}
              </Switch>
            </LayoutTag>
          </Route>
        );
      })}

      {redirectRoutes.map((route) => (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <Redirect from={route.path} key={route.path} to={route.to!} exact={route.exact} />
      ))}
    </Switch>
  );
}

export default App;
