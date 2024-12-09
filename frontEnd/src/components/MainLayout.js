import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

const MainLayout = ({ config = {}, children }) => {
  return (
    <div>
      <Navigation config={config} />
      {children &&
        React.Children.map(children, (child) =>
          React.cloneElement(child, { config })
        )}
      <Footer config={config} />
    </div>
  );
};

export default MainLayout;
