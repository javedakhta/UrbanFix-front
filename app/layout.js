// app/layout.js
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Urban Fix",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}