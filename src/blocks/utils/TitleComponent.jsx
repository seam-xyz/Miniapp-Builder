export default function TitleComponent(theme, title) {

  let primaryColor = theme.palette.primary.main
  let secondaryColor = theme.palette.secondary.main
  let teritaryColor = theme.palette.info.main

  return (
    <div style={{ backgroundColor: secondaryColor }}>
      <h2 style={{ color: teritaryColor, paddingLeft: 8 }}>{title}</h2>
    </div>
  )
}