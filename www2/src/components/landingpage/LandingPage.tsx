import React, { useEffect } from "react";
import { useGoogleOneTapLogin } from "react-google-one-tap-login";
import { getRequest } from "../../libs/network";
import { TVoidCalBack } from "../../libs/types";
import featureImage from "./asserts/feature-tile-icon-01.svg";
import explanationImage from "./asserts/features-split-image-01.png";
import "./asserts/LandingPage.scoped.css";
import logo from "./asserts/logo.svg";
import heroImage from "./asserts/video-placeholder.jpg";
export type TSectionItem = {
  title: string;
  subtitle: string;
  image: string;
};

export type TExplanationItem = {
  title: string;
  subtitle: string;
  explanation: string;
  image: string;
};

export type TPageConfig = {
  // hero
  logo_url: string;
  heroTitle: string;
  heroSubTitle: string;
  heroImage: string;
  heroVideoUrl: string;

  // features
  featuresTitle: string;
  featuresSubTitle: string;
  featureItems: Array<TSectionItem>;

  // Explnation
  explanationTitle: string;
  explanationSubTitle: string;
  explanationItems: Array<TExplanationItem>;

  // Testimonial
  testimonialTitle: string;
  testimonialSubTitle: string;
  testimonialItems: Array<{ author: string; review: string; designation: string }>;

  // followup
  emailTitle: string;

  // footer
  copyright: string;
  socialLink: { fb: string; tweeter: string; instagram: string };
};

export const samplePageConfig: TPageConfig = {
  // hero
  logo_url: logo,
  heroTitle: "Landing template for startups",
  heroSubTitle: "Our landing page template works on all devices, so you only have to set it up once, and get beautiful results forever.",
  heroImage: heroImage,
  heroVideoUrl: "https://player.vimeo.com/video/174002812",

  // features
  featuresTitle: "Build up the whole picture",
  featuresSubTitle:
    " Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum — semper quis lectus nulla at volutpat diam ut venenatis.",
  featureItems: [
    {
      title: "Robust Workflow",
      subtitle:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.",
      image: featureImage,
    },
    {
      title: "Robust Workflow",
      subtitle:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.",
      image: featureImage,
    },
    {
      title: "Robust Workflow",
      subtitle:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.",
      image: featureImage,
    },
    {
      title: "Robust Workflow",
      subtitle:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.",
      image: featureImage,
    },
    {
      title: "Robust Workflow",
      subtitle:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.",
      image: featureImage,
    },
    {
      title: "Robust Workflow",
      subtitle:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.",
      image: featureImage,
    },
  ],

  // Exp
  explanationTitle: "Workflow that just works",
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
  emailTitle: "For previewing layouts and visual?",
  copyright: "Powerd by SimpleStore. All right reserved",
  socialLink: {
    fb: "https://facebook.com/",
    tweeter: "https://twitter.com/",
    instagram: "https://google.com/",
  },
};

export type TProp = {
  pageConfig: TPageConfig;
  onNavigateToHome: TVoidCalBack;
};

export const LandingPage = ({ pageConfig, onNavigateToHome }: TProp) => {
  pageConfig = pageConfig || samplePageConfig;
  const [showVideoModel, setShowVideoModel] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [login, setlogin] = React.useState(false);

  async function doAutoLogin() {
    let res = await getRequest(
      "https://oauth2.googleapis.com/tokeninfo?id_token=290736876800-g9jg0bbgrgjkl2m2ta5hamabe2568lms.apps.googleusercontent.com"
    );
  }

  useEffect(() => {
    //const page = location.pathname;
    //document.body.classList.add("is-loaded");
    //childRef.current.init();
    //trackPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGoogleOneTapLogin({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (response) => {
      console.log(response);
    },
    googleAccountConfigs: {
      client_id: "290736876800-g9jg0bbgrgjkl2m2ta5hamabe2568lms.apps.googleusercontent.com", // Your google client id here !!!
    },
  });

  return (
    <div className="body">
    <div className="has-animations is-loaded 11">
      <div className="body_wrap">
        <header className="site-header reveal-from-bottom is-revealed">
          <div className="container">
            <div className="site-header-inner">
              <div className="brand">
                <h1 className="m-0">
                  <a href="/">
                    <img src={pageConfig.logo_url} width={32} height={32} />
                  </a>
                </h1>
              </div>
              <button className="header-nav-toggle">
                <span className="screen-reader">Menu</span>
                <span className="hamburger">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <nav className="header-nav">
                <div className="header-nav-inner">
                  <ul className="list-reset text-xs header-nav-right">
                    <li>
                      <a href="/#0">Features</a>
                    </li>
                  </ul>
                  <ul className="list-reset header-nav-right">
                    <li>
                      {!login ? (
                        <a className="button button-primary button-wide-mobile button-sm" onClick={(e) => setlogin(true)}>
                          Sign up
                        </a>
                      ) : (
                        <a className="button button-primary button-wide-mobile button-sm" onClick={(e) => onNavigateToHome?.()}>
                          Go to Home
                        </a>
                      )}
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </header>
        <main className="site-content">
          <section className="hero section center-content illustration-section-01">
            <div className="container-sm">
              <div className="hero-inner section-inner">
                <div className="hero-content">
                  <h1 className="mt-0 mb-16 reveal-from-bottom is-revealed" data-reveal-delay="200">
                    {pageConfig.heroTitle}
                  </h1>
                  <div className="container-xs">
                    <p className="mt-0 mb-32 reveal-from-bottom is-revealed" data-reveal-delay="400">
                      {pageConfig.heroSubTitle}
                    </p>
                    <div className="reveal-from-bottom is-revealed" data-reveal-delay="600">
                      <div className="button-group">
                        <a href="https://cruip.com/" className="button button-primary button-wide-mobile">
                          Get started
                        </a>
                        <a href="https://github.com//" className="button button-dark button-wide-mobile">
                          Join As Prime
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hero-figure reveal-from-bottom illustration-element-01 is-revealed" data-reveal-value="20px" data-reveal-delay="800">
                  <a data-video={pageConfig.heroVideoUrl} href="#0" aria-controls="video-modal">
                    <img className="has-shadow" src={pageConfig.heroImage} width="896" height="504" onClick={() => setShowVideoModel(true)} />
                  </a>
                </div>
                {showVideoModel && (
                  <div id="video-modal" className="modal is-active modal-video" onClick={() => setShowVideoModel(false)}>
                    <div className="modal-inner">
                      <div className="responsive-video">
                        <iframe title="video" src={pageConfig.heroVideoUrl}></iframe>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="features-tiles section">
            <div className="container">
              <div className="features-tiles-inner section-inner pt-0">
                <div className="section-header center-content">
                  <div className="container-xs">
                    <h2 className="mt-0 mb-16">{pageConfig.featuresTitle}</h2>
                    <p className="m-0"> {pageConfig.featuresSubTitle}</p>
                  </div>
                </div>
                <div className="tiles-wrap center-content">
                  {pageConfig.featureItems.map((item, index) => {
                    return (
                      <div className="tiles-item reveal-from-bottom is-revealed" key={index.toString()}>
                        <div className="tiles-item-inner">
                          <div className="features-tiles-item-header">
                            <div className="features-tiles-item-image mb-16">
                              <img src={item.image} width="64" height="64" />
                            </div>
                          </div>
                          <div className="features-tiles-item-content">
                            <h4 className="mt-0 mb-8">{item.title}</h4>
                            <p className="m-0 text-sm">{item.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="features-split section illustration-section-02">
            <div className="container">
              <div className="features-split-inner section-inner has-top-divider">
                <div className="section-header center-content">
                  <div className="container-xs">
                    <h2 className="mt-0 mb-16">{pageConfig.explanationTitle}</h2>
                    <p className="m-0">{pageConfig.explanationSubTitle}</p>
                  </div>
                </div>
                <div className="split-wrap invert-mobile">
                  {pageConfig.explanationItems.map((item, index) => {
                    return (
                      <div className="split-item" key={index.toString()}>
                        <div className="split-item-content center-content-mobile reveal-from-left is-revealed" data-reveal-container=".split-item">
                          <div className="text-xxs text-color-primary fw-600 tt-u mb-8">{item.subtitle}</div>
                          <h3 className="mt-0 mb-12">{item.title}</h3>
                          <p className="m-0">{item.explanation}</p>
                        </div>
                        <div
                          className="split-item-image center-content-mobile reveal-from-bottom split-item-image-fill is-revealed"
                          data-reveal-container=".split-item"
                        >
                          <img src={item.image} width="528" height="396" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="testimonial section">
            <div className="container">
              <div className="testimonial-inner section-inner has-top-divider">
                <div className="section-header center-content">
                  <div className="container-xs">
                    <h2 className="mt-0 mb-16">{pageConfig.testimonialTitle}</h2>
                    <p className="m-0">{pageConfig.testimonialSubTitle}</p>
                  </div>
                </div>
                <div className="tiles-wrap">
                  {pageConfig.testimonialItems.map((item, index) => {
                    return (
                      <div className="tiles-item reveal-from-right is-revealed" data-reveal-delay="200" key={index.toString()}>
                        <div className="tiles-item-inner">
                          <div className="testimonial-item-content">
                            <p className="text-sm mb-0">{item.review}</p>
                          </div>
                          <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                            <span className="testimonial-item-name text-color-high">{item.author}</span>
                            <span className="text-color-low"> / </span>
                            <span className="testimonial-item-link">
                              <a href="#0">{item.designation}</a>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
          <section className="cta section center-content-mobile reveal-from-bottom is-revealed">
            <div className="container">
              <div className="cta-inner section-inner cta-split">
                <div className="cta-slogan">
                  <h3 className="m-0">{pageConfig.emailTitle}</h3>
                </div>
                <div className="cta-action">
                  <label className="form-label screen-reader">Subscribe</label>
                  <div className="has-icon-right">
                    <input type="email" className="form-input" placeholder="Your best email" onChange={(e) => setEmail(e.target.value)} />
                    <svg
                      width="16"
                      height="12"
                      xmlns="http://www.svg"
                      onClick={() => {
                        console.log("sending email" + email);
                      }}
                      style={{ cursor: "pointer", zIndex: 2 }}
                    >
                      <path d="M9 5H1c-.6 0-1 .4-1 1s.4 1 1 1h8v5l7-6-7-6v5z" fill="#376DF9"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="site-footer center-content-mobile">
          <div className="container">
            <div className="site-footer-inner">
              <div className="footer-top space-between text-xxs">
                <div className="brand">
                  <h1 className="m-0">
                    <a href="/">
                      <img src={pageConfig.logo_url} width="32" height="32" />
                    </a>
                  </h1>
                </div>
                <div className="footer-social">
                  <ul className="list-reset">
                    <li>
                      <a href={pageConfig.socialLink.fb}>
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.svg">
                          <title>Facebook</title>
                          <path d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z"></path>
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a href={pageConfig.socialLink.tweeter}>
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.svg">
                          <title>Twitter</title>
                          <path d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z"></path>
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a href={pageConfig.socialLink.instagram}>
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.svg">
                          <title>Instagram</title>
                          <g>
                            <circle cx="12.145" cy="3.892" r="1"></circle>
                            <path d="M8 12c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
                            <path d="M12 16H4c-2.056 0-4-1.944-4-4V4c0-2.056 1.944-4 4-4h8c2.056 0 4 1.944 4 4v8c0 2.056-1.944 4-4 4zM4 2c-.935 0-2 1.065-2 2v8c0 .953 1.047 2 2 2h8c.935 0 2-1.065 2-2V4c0-.935-1.065-2-2-2H4z"></path>
                          </g>
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="footer-bottom space-between text-xxs invert-order-desktop">
                <nav className="footer-nav">
                  <ul className="list-reset">
                    <li>
                      <a href="/#contact">Contact</a>
                    </li>
                    <li>
                      <a href="/#features">Features</a>
                    </li>
                    <li>
                      <a href="/#example">Examples</a>
                    </li>
                    <li>
                      <a href="/#0">Support</a>
                    </li>
                  </ul>
                </nav>
                <div className="footer-copyright">{pageConfig.copyright}</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </div>
  );
};
