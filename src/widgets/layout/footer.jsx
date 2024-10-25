import PropTypes from "prop-types";
import { Typography, IconButton } from "@material-tailwind/react";

const year = new Date().getFullYear();

export function Footer({ title, description, socials, menus, copyright }) {
  return (
    <footer className="relative bg-gradient-to-r from-[#3D92F1] to-[#F9D6E4] text-black py-4">
      <style>
        {`
          .logo-zoom {
            transition: transform 1s ease-in-out;
            animation: zoomAnimation 1s infinite alternate;
          }

          @keyframes zoomAnimation {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(1.1);
            }
          }

          .icon-container {
            border: 2px solid #F9D6E4;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            margin: 0 5px;
          }

          .icon-container i {
            color: #F9D6E4;
          }

          .hover-link:hover {
            color: #b529b9;
          }
        `}
      </style>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-4">
          <div className="text-center lg:text-left">
            <div className="bg-white text-[#3D92F1] rounded-full w-24 h-24 flex items-center justify-center mx-auto lg:mx-0 mb-4">
              <img src="/img/logosans.png" height="50" alt="logo" loading="lazy" className="logo-zoom" />
            </div>
            <Typography variant="body2" className="text-center lg:text-left">
              {description}
            </Typography>
            <div className="mt-2 flex justify-center lg:justify-start space-x-2">
              {socials.map(({ color, name, path }) => (
                <a key={name} href={path} target="_blank" rel="noopener noreferrer" className="icon-container">
                  <IconButton color="white" className="rounded-full shadow-none bg-transparent">
                    <Typography color={color}>
                      <i className={`fab fa-${name}`} />
                    </Typography>
                  </IconButton>
                </a>
              ))}
            </div>
          </div>

          {menus.map(({ name, items }) => (
            <div key={name}>
              <Typography variant="h6" className="text-uppercase mb-2">
                {name}
              </Typography>
              <ul className="list-unstyled">
                {items.map((item) => (
                  <li className="mb-1" key={item.name}>
                    <Typography as="a" href={item.path} target="_blank" rel="noreferrer" variant="body2" className="text-white hover-link">
                      {item.name}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <Typography variant="h6" className="text-uppercase mb-2">Contact</Typography>
            <ul className="list-unstyled">
              <li className="mb-1">
                <Typography as="p" variant="body2"><i className="fas fa-map-marker-alt pe-2"></i>Warsaw, 57 Street, Poland</Typography>
              </li>
              <li className="mb-1">
                <Typography as="p" variant="body2"><i className="fas fa-phone pe-2"></i>+ 01 234 567 89</Typography>
              </li>
              <li>
                <Typography as="p" variant="body2"><i className="fas fa-envelope pe-2"></i>contact@example.com</Typography>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center p-2  mt-4">
          <Typography variant="body2" className="text-white">
            {copyright}
          </Typography>
        </div>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  title: "TechBadgets for everyone",
  description: "Easy to use. Join us right now.",
  socials: [
    { color: "white", name: "facebook", path: "#" },
    { color: "white", name: "instagram", path: "#" },
    { color: "white", name: "youtube", path: "#" },
  ],
  menus: [
    {
      name: "useful links",
      items: [
        { name: "About Us", path: "#" },
        { name: "Blog", path: "#" },
        { name: "Github", path: "#" },
        { name: "Free Products", path: "#" },
      ],
    },
    {
      name: "other resources",
      items: [
        { name: "MIT License", path: "#" },
        { name: "Contribute", path: "#" },
        { name: "Change Log", path: "#" },
        { name: "Contact Us", path: "#" },
      ],
    },
  ],
  copyright: `Copyright © ${year} Created by Esprit.`,
};

Footer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  socials: PropTypes.arrayOf(PropTypes.object),
  menus: PropTypes.arrayOf(PropTypes.object),
  copyright: PropTypes.node,
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
