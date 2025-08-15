import React from 'react'
import Home from './pages/Home'
import './styles.css'
import 'antd/dist/reset.css'
import { ConfigProvider, theme } from 'antd'

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#10b981',
          colorLink: '#10b981',
          colorLinkHover: '#059669',
          colorTextBase: '#064e3b',
          colorBgBase: '#ffffff',
          colorBorder: '#d1fae5',
          fontFamily:
            'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
          borderRadius: 10
        },
        components: {
          Button: { borderRadius: 10 },
          Card: { borderRadiusLG: 14 }
        }
      }}
    >
      <Home />
    </ConfigProvider>
  )
}

export default App
