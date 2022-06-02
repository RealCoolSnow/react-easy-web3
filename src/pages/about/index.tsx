import { useTranslation } from 'react-i18next'

const About = () => {
  const { t } = useTranslation()
  return <div className="py-4 text-center whitespace-pre-line">{t('about_msg')}</div>
}
export default About
