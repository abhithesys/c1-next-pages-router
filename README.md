# C1Chat with Next.js pages router

## Project Settings for create-next-app:

- Typescript: Yes
- Eslint: Yes
- Tailwind: No
- Code inside src/: Yes
- App Router: No

## Project specific update to use C1Chat:

```
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // added this line
+ transpilePackages: ["@thesysai/genui-sdk"],
};
```
