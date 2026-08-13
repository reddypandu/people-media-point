import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const TranslatedText = ({ children }) => {
  const { language, translateContent } = useLanguage();
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    let isMounted = true;
    
    const translate = async () => {
      if (typeof children !== 'string') {
        setTranslated(children);
        return;
      }
      
      try {
        const result = await translateContent(children);
        if (isMounted) setTranslated(result);
      } catch (error) {
        if (isMounted) setTranslated(children);
      }
    };

    translate();
    return () => { isMounted = false; };
  }, [language, children, translateContent]);

  return <>{translated}</>;
};

export default TranslatedText;
