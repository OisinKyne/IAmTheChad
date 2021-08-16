import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from "react"
import { AppBar, Button, Grid, Toolbar } from "@material-ui/core"
import { Link, useStaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({

    root: {
      display: 'grid',
      // borderRadius: '1em',
      padding: '1em',
      background: `linear-gradient(to bottom right, #ffab2e, #fa8034, #eb5541, #d3284d, #b20058, #88005f, #550061, #06005c)`
      // Not using background images as they can't be loaded in a performant manner
      // switched to StaticImage instead with overlapping grid elements.
      // backgroundImage: `url(${mobile_bg})`,
      // backgroundRepeat: `no-repeat`,
      // backgroundOrigin: `padding-box`,
      // backgroundPosition: '50%',
      // backgroundSize: `cover`,
    },
    bg_image: {
      gridArea: "1/1",
      minHeight: '100vh',
      maxHeight: '100vh',
      backgroundColor: '#fff',
      borderRadius: `1em`
    },
    infoButton: {
      margin: theme.spacing(1),
      color: '#000',
      backgroundColor: '#fff'
    },
    infoButtons: {
      alignSelf: 'flex-end',
      marginBottom: 'auto',
      justifyContent: 'center'
    },
    menu: {
      marginRight: theme.spacing(1),
      alignSelf: 'flex-end',
      marginBottom: 'auto',
      justifyContent: 'space-between'
    },
    menuLogo: {
      textDecoration: 'none',
      color: '#000',
      fontSize: '22pt',
      // backgroundColor: 'rgba(255, 255, 255, 0.85)',
      // borderRadius: '4px',
      // padding: '0.2rem 0.4rem',
      boxSizing: 'content-box',
      maxWidth: '2rem'
    },
    menuButton: {
      // marginRight: theme.spacing(1),
      // alignSelf: 'flex-end',
      // marginBottom: 'auto'
      color: '#000',
      backgroundColor: '#fff'
    },
    appbar: {
      backgroundColor: `transparent`,
      // backgroundColor: `rgba(75,75,75, 0.2)`,
      gridArea: '1/1',
      position: 'relative',
      placeItems: 'center',
      display: 'grid',
      boxShadow: 'none'
      // opacity: 0.72
    },
    toolbar: {
      minHeight: 450,
      height: '97vh',
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(2),
      flexDirection: 'column',
      backgroundColor: `transparent`,
    },
    link: {
      textDecoration: 'none',
      color: '#000',
    },
    learnMore: {
      alignSelf: 'center',
      margin: 'auto'
    },
    title: {
      alignSelf: 'center',
      font: "normal normal normal 42px/48px Montserrat",
      color: '#000',
      // backgroundColor: 'red',
      [theme.breakpoints.up('md')]: {
        font: "normal normal normal 64px/72px Montserrat",
      },
    },
    subtitle: {
      alignSelf: 'center',
      textAlign: 'center',
      margin: 'auto',
      font: "normal normal 500 26px/34px Montserrat",
      color: '#000',
      // textShadow: `0px 0px 5px #fff`,
      // backgroundColor: 'green',
      [theme.breakpoints.up('lg')]: {
        font: "normal normal 500 36px/48px Montserrat",
      },
    },
    hallOfFameDiv: {
      alignSelf: 'center',
      textAlign: 'center',
    },
    hallOfFameAddress: {
      color: '#000',
      lineHeight: '2rem'
    },
    hallOfFameLink: {
      textDecorationColor: '#000',
      color: '#000'
    }
  }),
);

export default function Header({ siteTitle, siteDescription }) {
  const classes = useStyles();
  // Retrieve basefee and hall of fame that was calculated at the data gathering stage of the build process.
  const data = useStaticQuery(graphql`
    query WhoIsTheChad {
      basefee {
        gwei
        wei
      }
      hof {
        hallOfFamers
        hallOfFamersENS
      }
    }
  `)

  console.log(`Gatsby grapql query returned: `)
  console.log(data)

  return (
    <div className={classes.root}>
      <StaticImage
        className={classes.bg_image}
        layout="fullWidth"
        loading="eager"
        alt="Background Image"
        placeholder="blurred"
        src={`../images/shittybg.png`}
      />
      <AppBar position="static" className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
          <Grid container className={classes.menu}>
            <Grid item>
              <Link to="/" className={classes.link}>
                {/* <ObolIconWhite className={classes.menuLogo} /> */}
                <StaticImage
                  className={classes.menuLogo}
                  layout="constrained"
                  loading="eager"
                  alt="Fire Emoji"
                  placeholder="blurred"
                  src={`../images/fire.png`}
                />
              </Link>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to={"https://opensea.io/assets/0x621a6d60c7c16a1ac9bba9cc61464a16b43cac51/1"}
                rel="noopener noreferrer"
                target="_blank"
                color="inherit"
                className={classes.menuButton}
                variant="outlined"
                size={'small'}>
                View on OpenSea
              </Button>
            </Grid>
          </Grid>
          {/* <div className={classes.obolLogo} /> */}
          <Typography className={classes.title} variant="h5">
            {siteTitle}
          </Typography>
          <Typography className={classes.subtitle} variant="h5" >
            {siteDescription}
          </Typography>
          {!!data.basefee && !!data.hof && (
            <Grid container className={classes.infoButtons}><Grid item>
              <Button
                color="inherit"
                className={classes.infoButton}
                variant="outlined"
                size={'large'}>
                Base Fee To Steal: {Number(data.basefee.gwei).toFixed(2).toString() + " "}gwei
              </Button>
            </Grid>
              <Grid item><Button
                color="inherit"
                className={classes.infoButton}
                variant="outlined"
                size={'large'}>
                Hall of Famers: {data.hof.hallOfFamers.length}
              </Button></Grid>
            </Grid>)}
          {!!data.hof && (<div className={classes.hallOfFameDiv}>
            <Typography className={classes.subtitle} variant="h5" >
              The Fallen Chads
            </Typography>
            {data.hof.hallOfFamers.slice(0, data.hof.hallOfFamers.length - 1).map((/** @type {string} */ hof, /** @type {number} */ index) => {
              return (
                <Typography className={classes.hallOfFameAddress} variant={"body2"} gutterBottom>{index + 1}.{" "}
                  <Link
                    to={`https://etherscan.io/address/${hof}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    // color="inherit"
                    className={classes.hallOfFameLink}>
                    {data.hof.hallOfFamersENS[index] ? data.hof.hallOfFamersENS[index] : 
                        hof.substring(0, 12) + "..." + hof.substring(hof.length - 12, hof.length)}
                  </Link>
                </Typography>
              )
            })}
          </div>)}

        </Toolbar>
      </AppBar>
    </div>

  )
}
