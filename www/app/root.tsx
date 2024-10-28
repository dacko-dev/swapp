import {
  json,
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp } from "@clerk/remix";

import { Notifications } from "@mantine/notifications";
import "./tailwind.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/tiptap/styles.css";

import { appTheme } from "./lib/theme";
import AppLayout from "./components/Layout/AppLayout/AppLayout";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const meta: MetaFunction = () => [
  {
    charset: "utf-8",
    title: "Swapp",
    viewport: "width=device-width,initial-scale=1",
  },
];

// export const loader: LoaderFunction = (args) => rootAuthLoader(args);

// IF WANT ADDITIONAL DATA
export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(args, () => {
    // const { sessionId, userId, getToken } = request.auth;

    // https://remix.run/docs/en/main/guides/envvars
    return json({
      GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
    });
  });
};

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center h-full space-y-4 my-auto mx-auto">
            <h1>Oh no!</h1>
            <p>Something went wrong.</p>
          </div>
        </div>

        <Scripts />
      </body>
    </html>
  );
}

export function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto" theme={appTheme}>
          <Notifications />
          <AppLayout>
            <Outlet />
          </AppLayout>
        </MantineProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default ClerkApp(App);
