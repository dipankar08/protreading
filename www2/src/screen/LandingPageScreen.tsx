import React from "react";
import { useHistory } from "react-router-dom";
import { CoreContext } from "../components/coreState/useCoreGlobalSate";
import featureImage from "../components/landingpage/asserts/feature-tile-icon-01.svg";
import explanationImage from "../components/landingpage/asserts/features-split-image-01.png";
import logo from "../components/landingpage/asserts/logo.svg";
import heroImage from "../components/landingpage/asserts/video-placeholder.jpg";
import { LandingPage, TPageConfig } from "../components/landingpage/LandingPage";
import { runQuery, TStockListItem } from "./network";
export const LandingPageScreen = () => {
  const history = useHistory();
  const coreContext = React.useContext(CoreContext);
  const [pageConfig, setPageConfig] = React.useState<TPageConfig>({
  // hero
  logo_url: logo,
  heroTitle: "Find and invest on potential stocks",
  heroSubTitle: "Trading 50 allows you to create advance filter to findout the best stocks for the trading. ",
  heroImage: heroImage,
  heroVideoUrl: "https://player.vimeo.com/video/174002812",

  // features
  featuresTitle: "What you should use Trading 50!",
  featuresSubTitle:
    "Trading 50 provides extremely powerful tools to scan the market ticker. It allows to write super complicated time series math expression with techincal indicators which runs in our server in few millisecond on live market data.",
  featureItems: [
    {
      title: "Powerful Math expression",
      subtitle:
        "Allow you to write complicated time series expression in a very simple way! It mote than filling up a form.",
      image: featureImage,
    },
    {
      title: "Filter on Live Data",
      subtitle:
        "For the premium users, filter can run on live market data or for free users it can be delayed at most 5 min.",
      image: featureImage,
    },
    {
      title: "High Performance Execution Engine",
      subtitle:
        "A extremely complicated filter can execute in few millisecond.  Just give it a try.",
      image: featureImage,
    },
    {
      title: "NSE, NASDAQ and LSE Support",
      subtitle:
        "Apply same filter in India/ UK or USA Stocks. We support top 200 tickers from LSE, NSE and NASDAQ",
      image: featureImage,
    },
    {
      title: "100+ Pre-build filters",
      subtitle:
        "The tools come-up with 100+ popular filters for long term and short term trading.",
      image: featureImage,
    },
    {
      title: "Real-time Alerts",
      subtitle:
        "Create alerts for your filters. Get realtime notification when you expression meets the conditions.",
      image: featureImage,
    },
  ],

  // Exp
  explanationTitle: "Market filters that just works",
  explanationSubTitle:
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum — semper quis lectus nulla at volutpat diam ut venenatis.",
  explanationItems: [
    {
      title: "Data-driven insights",
      subtitle: "LIGHTNING FAST WORKFLOW",
      explanation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua — Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: explanationImage,
    },
    {
      title: "Data-driven insights",
      subtitle: "LIGHTNING FAST WORKFLOW",
      explanation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua — Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: explanationImage,
    },
    {
      title: "Data-driven insights",
      subtitle: "LIGHTNING FAST WORKFLOW",
      explanation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua — Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: explanationImage,
    },
  ],

  testimonialTitle: "Customer testimonials",
  testimonialSubTitle:
    "Vitae aliquet nec ullamcorper sit amet risus nullam eget felis semper quis lectus nulla at volutpat diam ut venenatis tellus—inornare.",
  testimonialItems: [
    {
      author: "Roman Level",
      review:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sintoccaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum cillum dolore eu fugiat.",
      designation: "CEO, XYZ",
    },
    {
      author: "Roman Level",
      review:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sintoccaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum cillum dolore eu fugiat.",
      designation: "CEO, XYZ",
    },
    {
      author: "Roman Level",
      review:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sintoccaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum cillum dolore eu fugiat.",
      designation: "CEO, XYZ",
    },
    
  ],

  //footer
  emailTitle: "Request for a free license?",
  copyright: "Powerd by SimpleStore. All right reserved",
  socialLink: {
    fb: "https://facebook.com/",
    tweeter: "https://twitter.com/",
    instagram: "https://google.com/",
  },
  notificationText:'Welcome to trading 50. This application is in Beta Mode ! Please expect bugs ',
});

 React.useEffect(()=>{
   runQuery("1","IN","", {
      onBefore:()=>{
        setPageConfig({...pageConfig, notificationText:'Welcome to trading 50. This application is in Beta Mode ! Please expect bugs'})
      },
      onSuccess:(data)=>{
        setPageConfig({...pageConfig, notificationText:getNotificationTextFromData(data)})
      }
   });
 },[])
  return (
    <LandingPage
      pageConfig={pageConfig}
      onNavigateToHome={() => {
        history.push("/home");
      }}
    ></LandingPage>
  );
};
function getNotificationTextFromData(data: any): string {
  let sorteddata = data.result as Array<TStockListItem>
  sorteddata.sort((x,y)=>x.change > y.change ?1:-1)
  let looser = sorteddata.slice(0,10).map(x=> `${x.name}/${x.symbol} (${x.change} %)`).join(' | ')
  let gainer = sorteddata.slice(-10).map(x=> `${x.name}-${x.symbol}   (${x.change} %)`).join('   |   ')
  return `Top gainer: ${gainer} ||  Top Looser: ${looser}`
}

