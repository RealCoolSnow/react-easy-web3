import i18n from '@/locale'
import { Dispatch, RootState } from '@/store'
import InfoIcon from '@mui/icons-material/Info'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import {
  MenuItem,
  Menu,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  Divider,
  ListItemText,
} from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Logo from './Logo'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ConnectWallet from './ConnectWallet'

const LanguageSwitch = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch<Dispatch>()
  const language = useSelector((state: RootState) => state.common.language)
  const languageList = {
    en: 'English',
    cn: '中文简体',
  }

  const onLocaleChanged = (locale: string) => {
    dispatch.common.setLanguage(locale)
    i18n?.changeLanguage(locale)
    setAnchorEl(null)
  }

  return (
    <div className="flex items-center">
      {/* <LanguageIcon color="primary" /> */}
      <div
        id="btn-language-picker"
        // className="ml-1"
        onClick={(e) => {
          setAnchorEl(e.currentTarget)
        }}
      >
        {languageList[language]}
      </div>
      <ArrowDropDownIcon color="disabled" />
      <Menu
        open={open}
        anchorEl={anchorEl}
        MenuListProps={{
          'aria-labelledby': 'btn-language-picker',
        }}
      >
        {Object.keys(languageList).map((key, index) => (
          <MenuItem key={key} onClick={() => onLocaleChanged(key)}>
            {languageList[key]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

const Header = () => {
  const drawerAnchor = 'left'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { t } = useTranslation()
  const toggleDrawer = (open: boolean) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setDrawerOpen(open)
  }
  const menuList = [
    {
      title: 'Home',
      link: '/',
    },
    {
      title: 'About',
      link: '/about',
    },
  ]
  const drawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuList.map((item, index) => (
          <a href={item.link} key={item.title}>
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  {index == 0 ? <HomeIcon /> : <span></span>}
                  {index == 1 ? <InfoIcon /> : <span></span>}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          </a>
        ))}
      </List>
      <Divider />
    </Box>
  )
  return (
    <div className="flex items-center w-full px-2 py-4 bg-white">
      <React.Fragment key={drawerAnchor}>
        <MenuIcon onClick={toggleDrawer(true)} />
        <Drawer
          anchor={drawerAnchor}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          {drawerList()}
        </Drawer>
      </React.Fragment>
      <div className="flex-1 flex items-center justify-center">
        <Logo />
        <span className="ml-2 hidden md:block">{t('app_name')}</span>
      </div>
      <div className="ml-auto">
        <ConnectWallet />
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <div className="w-full flex items-center justify-center px-4 relative">
      <span className="text-gray-500 text-sm">Copyright (c) CoolSnow</span>
      <div className="absolute right-4">
        <LanguageSwitch />
      </div>
    </div>
  )
}
export { Header, Footer }
