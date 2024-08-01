const data = {
  amountYear: 100,
  startDate: 1930,
  endDate: 2016,
  categoryData: [
    {
      category: 'Kindheit & Jugend',
      colors: { main: '#f8ecb2', secondary: '#e4d28e', base: '#ebcc3c' },
      date: { from: 1930, to: 1945 },
    },
    {
      category: 'Flucht',
      colors: { main: '#fccb8e', secondary: '#e6b26f', base: '#e78b0a' },
      date: { from: 1945, to: 1946 },
    },
    {
      category: 'Ausbildung',
      colors: { main: '#f5aea8', secondary: '#e29d93', base: '#e25d60' },
      date: { from: 1946, to: 1959 },
    },
    {
      category: 'Familiengründung',
      colors: { main: '#c4a5a3', secondary: '#a88b85', base: '#825251' },
      date: { from: 1959, to: 1963 },
    },
    {
      category: 'Familie & Firma',
      colors: { main: '#c2cebd', secondary: '#a5b19e', base: '#7b9376' },
      date: { from: 1963, to: 1983 },
    },
    {
      category: 'Witwe',
      colors: { main: '#b9bac9', secondary: '#9a9bb1', base: '#686c91' },
      date: { from: 1983, to: 1987 },
    },
    {
      category: 'Witwe & Großmutter',
      colors: { main: '#dbc6da', secondary: '#bb9cbb', base: '#a1659f' },
      date: { from: 1987, to: 2017 },
    },
    {
      category: 'After Death',
      colors: { main: '#dde2e1', secondary: '#ced2d0', base: '#c0c9ce' },
      date: { from: 2017, to: 2030 },
    },
  ],
  personDate: [
    {
      date: -1248670800,
      description:
        'geboren am Pfingstsonntag 8 Juni 1930 Ruth Magarethe Bressau in Domnau, Ostpreußen. Sternbild Zwilling',
      icon: "<svg xmlns='http://www.w3.org/2000/svg' width='70' height='71' viewBox='0 0 70 71' fill='none'><path d='M25.3578 11.8021C25.3548 4.37795 33.3898 -0.265297 39.8208 3.44421C42.8077 5.16716 44.6475 8.35379 44.6462 11.8021C44.6491 19.2262 36.6141 23.8694 30.1832 20.1599C27.1962 18.437 25.3564 15.2503 25.3578 11.8021ZM10.3155 19.3701C12.0568 16.9724 15.4055 16.45 17.8031 18.1913L22.652 21.7142C26.2418 24.3261 30.5683 25.7326 35.0019 25.7326C39.4356 25.7326 43.7621 24.3261 47.3519 21.7142L52.2008 18.1779C54.5984 16.4366 57.9471 16.9724 59.6884 19.3567C61.4298 21.7409 60.894 25.103 58.5097 26.8443L53.6608 30.3805C51.8391 31.7066 49.8969 32.8184 47.8609 33.7292V38.5915H22.143V33.7292C20.107 32.8318 18.1648 31.7066 16.3431 30.3805L11.4942 26.8443C9.09656 25.103 8.57416 21.7543 10.3155 19.3567V19.3701ZM22.3439 44.1235L30.4611 51.2227L26.9785 56.2056L30.2334 59.4605C32.323 61.5501 32.323 64.9389 30.2334 67.0419C28.1439 69.1449 24.755 69.1315 22.652 67.0419L16.2225 60.6124C14.3741 58.764 14.1196 55.8707 15.6064 53.7409L22.3305 44.1235H22.3439ZM39.5562 51.2227L47.6734 44.1235L54.3975 53.7409C55.8843 55.8707 55.6298 58.764 53.7947 60.599L47.3653 67.0285C45.2757 69.1181 41.8868 69.1181 39.7839 67.0285C37.6809 64.9389 37.6943 61.5501 39.7839 59.4471L43.0388 56.1922L39.5562 51.2093V51.2227Z' fill='white'/></svg>",
    },
    {
      date: -1104559200,
      description: 'ab Sommer 1935 Grundschule',
      icon: "<svg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70' fill='none'><path d='M34.9972 1.77197C32.6998 1.77197 30.8437 3.62808 30.8437 5.92549V8.4176C21.3685 10.3386 14.2296 18.7235 14.2296 28.7698V31.21C14.2296 37.3105 11.9841 43.2033 7.93442 47.7722L6.97392 48.8495C5.88362 50.0696 5.62403 51.8218 6.286 53.3145C6.94798 54.8072 8.44064 55.7677 10.0761 55.7677H59.9183C61.5537 55.7677 63.0334 54.8072 63.7084 53.3145C64.3833 51.8219 64.1107 50.0696 63.0204 48.8495L62.0599 47.7722C58.0102 43.2033 55.7648 37.3235 55.7648 31.21V28.7698C55.7648 18.7235 48.6259 10.3386 39.1507 8.4176V5.92549C39.1507 3.62808 37.2946 1.77197 34.9972 1.77197ZM40.877 65.801C42.4346 64.2435 43.3042 62.1277 43.3042 59.9212H26.6901C26.6901 62.1277 27.5598 64.2435 29.1174 65.801C30.6749 67.3586 32.7906 68.2282 34.9972 68.2282C37.2037 68.2282 39.3194 67.3586 40.877 65.801Z' fill='white'/></svg>",
    },
    {
      date: -786866400,
      description:
        '25. Jan 1945 Flucht aus Ostpreußen mit Mutter Herta sowie den Geschwistern Erika 9, Helga 7, Inge 4. Über Pillau nach Gotenhafen. Von dort in einem Begleitboot der Gustloff nach Sassnitz. Dann per Zug nach Plön.',
      icon: "<svg xmlns='http://www.w3.org/2000/svg' width='70' height='71' viewBox='0 0 70 71' fill='none'><path d='M23.9217 9.5346C23.9217 7.49202 25.5719 5.8418 27.6145 5.8418H42.3857C44.4283 5.8418 46.0785 7.49202 46.0785 9.5346V13.2274H51.6177C54.6758 13.2274 57.1569 15.7085 57.1569 18.7666V33.5378L62.2807 35.2458C64.9464 36.1343 65.685 39.5733 63.6078 41.4658L51.9524 52.1519C50.0829 53.2366 47.948 53.8944 46.0785 53.8944C43.8167 53.8944 41.3702 53.0058 39.2468 51.5518C36.6965 49.7631 33.2922 49.7631 30.7418 51.5518C28.7685 52.9135 26.3566 53.8944 23.9101 53.8944C22.0407 53.8944 19.9057 53.2366 18.0363 52.1519L6.38085 41.4658C4.30365 39.5617 5.0422 36.1343 7.70795 35.2458L12.8433 33.5378V18.7666C12.8433 15.7085 15.3244 13.2274 18.3825 13.2274H23.9217V9.5346ZM20.2289 31.0798L32.669 26.9369C34.1808 26.4292 35.8194 26.4292 37.3427 26.9369L49.7713 31.0798V20.613H20.2289V31.0798ZM37.135 54.5291C39.7315 56.3178 42.905 57.5411 46.0785 57.5411C49.1828 57.5411 52.4717 56.2947 55.0105 54.5291C56.3837 53.5482 58.2532 53.629 59.5342 54.7253C61.1959 56.0986 63.2847 57.1487 65.3734 57.6334C67.3583 58.095 68.5931 60.0799 68.1315 62.0648C67.6699 64.0497 65.685 65.2844 63.7001 64.8228C60.8728 64.165 58.5186 62.9187 56.9838 61.9378C53.6372 63.7381 49.8867 64.9267 46.0785 64.9267C42.3972 64.9267 39.0853 63.7842 36.8003 62.7456C36.131 62.434 35.5194 62.134 35.0001 61.857C34.4808 62.134 33.8807 62.4456 33.1998 62.7456C30.9149 63.7842 27.6029 64.9267 23.9217 64.9267C20.1135 64.9267 16.363 63.7381 13.0164 61.9494C11.47 62.9187 9.12737 64.1766 6.30006 64.8344C4.31518 65.296 2.3303 64.0612 1.86871 62.0763C1.40711 60.0914 2.64189 58.1065 4.62677 57.6449C6.71551 57.1602 8.80425 56.1101 10.466 54.7368C11.747 53.6521 13.6164 53.5713 14.9897 54.5407C17.54 56.2947 20.8174 57.5411 23.9217 57.5411C27.0952 57.5411 30.2687 56.3178 32.8652 54.5291C34.1461 53.6175 35.854 53.6175 37.135 54.5291Z' fill='white'/></svg>",
    },
    {
      date: -764056800,
      description: '16. Okt. 1945 per LKW von Plön nach Dissen a.T.W.',
      icon: "<svg xmlns='http://www.w3.org/2000/svg' width='70' height='71' viewBox='0 0 70 71' fill='none'><path d='M6.75619 8.80371C4.00449 8.80371 1.77197 11.0362 1.77197 13.7879V47.0161C1.77197 49.7678 4.00449 52.0003 6.75619 52.0003H8.4176C8.4176 57.5037 12.8826 61.9687 18.386 61.9687C23.8894 61.9687 28.3545 57.5037 28.3545 52.0003H41.6457C41.6457 57.5037 46.1108 61.9687 51.6142 61.9687C57.1176 61.9687 61.5826 57.5037 61.5826 52.0003H64.9054C66.7433 52.0003 68.2282 50.5154 68.2282 48.6775C68.2282 46.8395 66.7433 45.3546 64.9054 45.3546V33.4444C64.9054 31.6792 64.2097 29.9866 62.9636 28.7406L54.937 20.7139C53.6909 19.4679 51.9984 18.7721 50.2331 18.7721H44.9685V13.7879C44.9685 11.0362 42.736 8.80371 39.9843 8.80371H6.75619ZM44.9685 25.4178H50.2331L58.2598 33.4444V35.3862H44.9685V25.4178ZM13.4018 52.0003C13.4018 48.1634 17.5553 45.7654 20.8781 47.6838C22.4203 48.5742 23.3703 50.2196 23.3703 52.0003C23.3703 55.8371 19.2167 58.2352 15.8939 56.3167C14.3518 55.4264 13.4018 53.781 13.4018 52.0003ZM51.6142 47.0161C55.451 47.0159 57.849 51.1693 55.9307 54.4922C55.0404 56.0344 53.3949 56.9845 51.6142 56.9845C47.7773 56.9845 45.3793 52.831 47.2977 49.5082C48.1881 47.966 49.8334 47.016 51.6142 47.0161Z'fill='white'/></svg>",
    },
    {
      date: -757404000,
      description: 'ab Frühjahr 1946 Mittelschule in Dissen.',
      icon: "<svg xmlns='http://www.w3.org/2000/svg' width='70' height='71' viewBox='0 0 70 71' fill='none'><path d='M30.5697 60.6846C31.8157 61.123 33.1541 60.2115 33.1541 58.8962V15.3535C33.1541 14.869 32.9695 14.3844 32.5772 14.0844C30.3159 12.2846 25.124 9.97705 18.386 9.97705C12.5596 9.97705 7.11386 11.5115 3.86027 12.7576C2.55653 13.2653 1.77197 14.5575 1.77197 15.9535V58.677C1.77197 60.05 3.24878 61.0076 4.55252 60.5807C8.18685 59.3693 13.9441 57.9732 18.386 57.9732C22.2973 57.9732 27.5007 59.5885 30.5697 60.6846ZM39.4305 60.6846C42.4995 59.5885 47.7029 57.9732 51.6142 57.9732C56.0561 57.9732 61.8133 59.3693 65.4477 60.5807C66.7514 61.0191 68.2282 60.05 68.2282 58.677V15.9535C68.2282 14.5575 67.4437 13.2653 66.1399 12.7691C62.8863 11.5115 57.4406 9.97705 51.6142 9.97705C44.8762 9.97705 39.6843 12.2846 37.423 14.0844C37.0422 14.3844 36.8461 14.869 36.8461 15.3535V58.8962C36.8461 60.2115 38.196 61.123 39.4305 60.6846Z' fill='white'/></svg>",
    },
    {
      date: -694332000,
      description: 'ab Herbst 1948 Lehre zur Apothekerin in Dissen.',
      icon: "<svg xmlns='http://www.w3.org/2000/svg' width='70' height='71' viewBox='0 0 70 71' fill='none'><path d='M38.9725 7.75356L38.9595 8.37672H47.4629C54.3435 8.37672 59.9259 13.9591 59.9259 20.8397C59.9259 27.7203 54.3435 33.3027 47.4629 33.3027H42.27V22.9168H47.4629C48.6054 22.9168 49.5401 21.9821 49.5401 20.8397C49.5401 19.6972 48.6054 18.7625 47.4629 18.7625H38.635L38.0508 37.457H43.3086C50.1892 37.457 55.7716 43.0394 55.7716 49.92C55.7716 56.8006 50.1892 62.383 43.3086 62.383H41.2314V51.9971H43.3086C44.451 51.9971 45.3858 51.0624 45.3858 49.92C45.3858 48.7775 44.451 47.8428 43.3086 47.8428H37.7262L37.3238 60.7602L37.142 66.4075V66.5373C37.1031 67.6927 36.1554 68.6145 34.9999 68.6145C33.8445 68.6145 32.8968 67.6927 32.8579 66.5373V66.4075L32.728 62.383H27.7299C24.8608 62.383 22.537 60.0591 22.537 57.19C22.537 54.321 24.8608 51.9971 27.7299 51.9971H32.4035L32.2737 47.8428H29.807C22.9264 47.8428 17.3441 42.2604 17.3441 35.3798C17.3441 29.2003 21.8359 24.0723 27.7299 23.0856V35.3798C27.7299 36.5223 28.6646 37.457 29.807 37.457H31.9491L31.3649 18.7625H25.9902C24.8219 21.2162 22.3163 22.9169 19.4212 22.9169H17.3441C13.3325 22.9169 10.074 19.6583 10.074 15.6468C10.074 11.6352 13.3325 8.37672 17.3441 8.37672H31.0403L31.0274 7.75356L30.9754 6.29955V6.05288C31.0403 3.89782 32.8059 2.1582 34.9999 2.1582C37.1939 2.1582 38.9595 3.89782 39.0245 6.05288V6.29955L38.9725 7.75356ZM18.3826 16.6854C19.9816 16.6868 20.9826 14.9568 20.1844 13.5713C19.8132 12.9271 19.1261 12.5304 18.3826 12.531C16.7836 12.5296 15.7827 14.2596 16.5809 15.6451C16.952 16.2893 17.6392 16.6861 18.3826 16.6854Z' fill='white'/></svg>",
    },
    {
      date: -410248800,
      description: '1957 Ruth Lernt Piet auf dem Dissener Schützenfest kennen.',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="71" viewBox="0 0 70 71" fill="none"><g clip-path="url(#clip0_59_899)"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.7274 21.1851C15.6815 21.1846 13.715 20.3934 12.2387 18.977C10.7625 17.5605 9.89075 15.6284 9.80573 13.5842H25.652C25.5669 15.6289 24.6948 17.5615 23.2179 18.978C21.7411 20.3945 19.7738 21.1853 17.7274 21.1851ZM8.07323 5.63048C6.35817 7.80192 5.42425 10.4876 5.42198 13.2546C5.42142 16.1635 6.45133 18.9785 8.32897 21.2001C10.2066 23.4218 12.8106 24.9065 15.6788 25.3907C18.547 25.875 21.4941 25.3275 23.9971 23.8454C26.5 22.3634 28.397 20.0425 29.3515 17.2948C30.306 14.547 30.2562 11.5499 29.211 8.83537C28.1657 6.12081 26.1927 3.86429 23.6419 2.46618C21.0911 1.06808 18.1275 0.6188 15.2769 1.19806C12.4263 1.77733 9.87312 3.34768 8.07031 5.63048H8.07323ZM2.41198 43.4246C2.39408 41.4088 2.77792 39.4096 3.54111 37.5437C4.3043 35.6778 5.43153 33.9827 6.85701 32.5572C8.28248 31.1317 9.97764 30.0045 11.8435 29.2413C13.7094 28.4781 15.7086 28.0942 17.7245 28.1121C19.7403 28.0942 21.7395 28.4781 23.6054 29.2413C25.4713 30.0045 27.1665 31.1317 28.5919 32.5572C30.0174 33.9827 31.1447 35.6778 31.9078 37.5437C32.671 39.4096 33.0549 41.4088 33.037 43.4246V51.7371C33.037 52.1239 32.8833 52.4949 32.6098 52.7683C32.3363 53.0418 31.9654 53.1955 31.5786 53.1955H27.3174L25.2699 68.5546C25.2232 68.9052 25.0508 69.2268 24.7846 69.4597C24.5185 69.6925 24.1768 69.8207 23.8232 69.8205H11.3545C11.0014 69.82 10.6604 69.6915 10.3949 69.4587C10.1294 69.2259 9.95734 68.9047 9.91073 68.5546L7.86031 53.1955H3.87323C3.48645 53.1955 3.11552 53.0418 2.84203 52.7683C2.56854 52.4949 2.41489 52.1239 2.41489 51.7371V43.4246H2.41198ZM49.5832 27.7155C44.3916 27.7155 39.8795 31.2796 38.5874 36.413L34.0811 52.4634C34.0246 52.6655 34.0123 52.8775 34.0451 53.0848C34.078 53.2921 34.1552 53.4899 34.2715 53.6646C34.3878 53.8393 34.5404 53.9869 34.719 54.0972C34.8976 54.2075 35.0978 54.278 35.3061 54.3038L40.9353 55.0096L42.4957 68.5342C42.5372 68.889 42.7073 69.2162 42.974 69.4538C43.2406 69.6914 43.5852 69.823 43.9424 69.8234H55.2211C55.5788 69.8237 55.9241 69.6925 56.1914 69.4548C56.4586 69.2171 56.6292 68.8895 56.6707 68.5342L58.2311 55.0096L63.8603 54.3038C64.0683 54.2779 64.2682 54.2075 64.4465 54.0974C64.6249 53.9872 64.7773 53.84 64.8936 53.6656C65.0098 53.4912 65.0872 53.2938 65.1202 53.0869C65.1533 52.8799 65.1414 52.6683 65.0853 52.4663L60.5907 36.4538C59.5699 31.2038 54.6903 27.7155 49.5832 27.7155ZM41.6616 13.5871H57.5049C57.4837 14.1363 57.4055 14.6817 57.2716 15.2146C57.208 15.3674 57.162 15.5269 57.1345 15.6901C56.6191 17.2869 55.6106 18.6792 54.254 19.6669C52.8974 20.6545 51.2627 21.1865 49.5847 21.1865C47.9067 21.1865 46.2719 20.6545 44.9154 19.6669C43.5588 18.6792 42.5503 17.2869 42.0349 15.6901C42.0073 15.5269 41.9613 15.3674 41.8978 15.2146C41.7618 14.6819 41.6816 14.1365 41.6586 13.5871H41.6616ZM39.9261 5.6334C38.0775 7.96711 37.1414 10.8938 37.2924 13.8671H33.7691C33.1889 13.8671 32.6325 14.0976 32.2223 14.5079C31.812 14.9181 31.5816 15.4745 31.5816 16.0546C31.5816 16.6348 31.812 17.1912 32.2223 17.6014C32.6325 18.0117 33.1889 18.2421 33.7691 18.2421H36.5311L35.2274 21.223C34.9949 21.7548 34.9833 22.3572 35.195 22.8976C35.4066 23.438 35.8243 23.8722 36.3561 24.1046C36.888 24.3371 37.4903 24.3488 38.0308 24.1371C38.5712 23.9254 39.0054 23.5077 39.2378 22.9759L40.072 21.0655C41.2254 22.4725 42.677 23.6056 44.3219 24.3829C45.9668 25.1602 47.7639 25.5623 49.5832 25.5601C51.4023 25.5615 53.199 25.1588 54.8433 24.381C56.4877 23.6032 57.9388 22.4697 59.0916 21.0626L59.9286 22.973C60.0435 23.2363 60.2092 23.4744 60.4161 23.6737C60.6231 23.873 60.8672 24.0296 61.1347 24.1346C61.4021 24.2395 61.6876 24.2908 61.9749 24.2854C62.2621 24.28 62.5455 24.2181 62.8089 24.1032C63.0722 23.9883 63.3103 23.8226 63.5096 23.6157C63.7089 23.4088 63.8655 23.1646 63.9705 22.8972C64.0754 22.6297 64.1267 22.3442 64.1213 22.0569C64.1159 21.7697 64.054 21.4863 63.9391 21.223L62.6324 18.2392H65.3974C65.9776 18.2392 66.534 18.0088 66.9442 17.5985C67.3544 17.1883 67.5849 16.6319 67.5849 16.0517C67.5849 15.4716 67.3544 14.9152 66.9442 14.5049C66.534 14.0947 65.9776 13.8642 65.3974 13.8642H61.8741C61.9729 11.8883 61.5931 9.91772 60.7669 8.12009C59.9407 6.32246 58.6926 4.75095 57.1286 3.53923C54.9729 1.85818 52.3169 0.946475 49.5832 0.949232C47.7387 0.94651 45.9172 1.35969 44.2543 2.15804C42.5915 2.9564 41.13 4.11938 39.9786 5.56048L39.9261 5.62756V5.6334Z" fill="white"/></g><defs><clipPath id="clip0_59_899"><rect width="70" height="70" fill="white" transform="translate(0 0.386719)"/></clipPath></defs></svg>`,
    },
  ],
};

class CanvasDrawer {
  constructor(canvasId, wrapperSelector, imageSelector, data) {
    this.canvas = document.getElementById(canvasId);
    this.canvasWrapper = document.querySelector(wrapperSelector);
    this.image = document.querySelector(imageSelector);
    this.ctx = this.canvas.getContext('2d');
    this.data = data;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerWidth;

    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.radiusLarge = this.canvas.width - 100;
    this.radius = this.radiusLarge / 3;
    this.startAngle = -Math.PI / 2;
    this.endAngle = this.startAngle + 2 * Math.PI;
    this.deg = 360;

    this.init();
  }

  init() {
    this.drawInitialCircles();
    this.drawTriangle();
    this.setImagePosition();
    this.drawOverlappingCircles();
    this.drawDotsForBigCircle();
    this.drawNumForCircle();
    this.drawTextForCategories();
  }

  drawInitialCircles() {
    this.drawCircleWithOneColor(this.radiusLarge / 2, this.canvas.width * 0.019, '#EAE9EB');
    this.drawCircleWithOneColor(this.radius, this.canvas.width * 0.018, '#F2F2F2');
  }

  setImagePosition() {
    this.image.style.left = `${this.centerX - this.radius / 2}px`;
    this.image.style.top = `${this.centerY - this.radius / 2}px`;
    this.image.style.width = `${this.radius}px`;
    this.image.style.height = `${this.radius}px`;
  }

  drawOverlappingCircles() {
    const mainSizeRadiusOpacity = {
      0.06: this.canvas.width * 0.02,
      0.04: this.canvas.width * 0.04,
      0.02: this.canvas.width * 0.066,
    };
    const whiteColor = '#ffffff';
    const opacities = {
      0.02: '33',
      0.04: '66',
      0.06: '99',
    };

    for (const [opacity, size] of Object.entries(mainSizeRadiusOpacity)) {
      this.drawCircleWithOneColor(this.radius / 2, size, `${whiteColor}${opacities[opacity]}`);
    }
  }

  drawTriangle() {
    const { categoryData } = this.data;
    let startingAngle = this.startAngle;

    for (const item of categoryData) {
      const year = item.date.to === item.date.from ? 1 : item.date.to - item.date.from;
      const interval = (year * this.deg) / 100;
      const arcSize = this.degreesToRadians(interval);
      const endingAngle = startingAngle + arcSize;

      this.drawArcSegment(startingAngle, endingAngle, item.colors.base);
      this.drawArcSegment(startingAngle, endingAngle, item.colors.secondary, this.radius - 3);
      this.drawArcSegment(startingAngle, endingAngle, item.colors.main, this.radius - this.canvas.width * 0.028);

      startingAngle = endingAngle;
    }
  }

  drawArcSegment(startAngle, endAngle, color, radius = this.radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.arc(this.centerX, this.centerY, radius, startAngle, endAngle, false);
    this.ctx.fillStyle = color;
    this.ctx.lineTo(this.centerX, this.centerY);
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawCircleWithOneColor(radius, lineWidth, strokeStyle) {
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, radius, this.startAngle, this.endAngle);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke();
  }

  drawDotsForBigCircle() {
    const { categoryData, amountYear, personDate } = this.data;
    const divisions = 2;
    const angleStep = (this.endAngle - this.startAngle) / amountYear;
    const adjustedStartAngle = this.startAngle + angleStep / divisions;
    const firstDate = categoryData[0].date.from;
    const lastDate = categoryData[categoryData.length - 1].date.to;

    for (let i = firstDate; i < lastDate; i++) {
      const angle = adjustedStartAngle + (i - firstDate) * angleStep;
      const dateX = this.centerX + (this.radius - this.canvas.width * 0.014) * Math.cos(angle);
      const dateY = this.centerY + (this.radius - this.canvas.width * 0.014) * Math.sin(angle);
      const fontSizeDate = this.canvas.width * 0.008;
      const dotX = this.centerX + (this.radius + this.canvas.width * 0.0046) * Math.cos(angle);
      const dotY = this.centerY + (this.radius + this.canvas.width * 0.0046) * Math.sin(angle);
      const dotSize = this.canvas.width * 0.006;
      const iconCircle = this.createIconCircle();

      let { bgColor, borderColor } = this.getColorsForDate(i, categoryData, personDate);

      this.drawOneDot('dot', dotX + dotSize / 2, dotY, dotSize, bgColor, borderColor);
      this.drawOneDot(
        'dot',
        this.centerX + (this.radius / 2 + this.canvas.width * 0.016) * Math.cos(angle) + dotSize / 2,
        this.centerY + (this.radius / 2 + this.canvas.width * 0.016) * Math.sin(angle),
        this.canvas.width * 0.0045,
        bgColor,
        borderColor
      );
      this.addTextForCircle(dateX, dateY, fontSizeDate, lastDate - firstDate, angle, i, firstDate);

      const descriptionWidth = this.canvas.width * 0.12;
      const descriptionX = this.centerX + (this.radius + descriptionWidth / 4) * Math.cos(angle);
      const descriptionY = this.centerY + (this.radius + descriptionWidth / 4) * Math.sin(angle);

      const person = personDate.find((item) => {
        const date = new Date(item.date * 1000);

        return date.getFullYear() === i;
      });

      if (person) {
        const isAt12OClock = Math.abs(angle) < 0.1 || Math.abs(angle - 2 * Math.PI) < 0.1;
        const adjustedAngle = isAt12OClock ? angle + Math.PI / 3 : angle;

        this.writeDescriptions(person.description, descriptionX, descriptionY, descriptionWidth, adjustedAngle);
      }
    }
  }

  writeDescriptions(text, x, y, descriptionWidth, angle) {
    const p = document.createElement('p');
    const textSize = this.canvas.width * 0.01;

    p.innerHTML = text;
    p.style.fontSize = `${textSize}px`;
    p.style.position = 'absolute';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.width = `${descriptionWidth}px`;

    if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
      p.style.textAlign = `left`;
    } else {
      p.style.textAlign = `right`;
    }

    this.canvasWrapper.appendChild(p);
  }

  createIconCircle() {
    const iconCircle = document.createElement('div');
    iconCircle.classList.add('icon-circle');
    iconCircle.style.borderWidth = `${this.canvas.width * 0.0018}px`;
    return iconCircle;
  }

  getColorsForDate(year, categoryData, personDate) {
    let bgColor = '#ffffff';
    let borderColor;

    for (const item of categoryData) {
      if (item.date.to >= year && item.date.from <= year) {
        borderColor = item.colors.secondary;

        for (const text of personDate) {
          const date = new Date(text.date * 1000);

          if (date.getFullYear() === year) {
            bgColor = item.colors.main;
          }
        }
      }
    }

    return { bgColor, borderColor };
  }

  drawOneDot(className, x, y, size, bgColor, borderColor, borderWidth = 2.5) {
    const dot = document.createElement('span');
    dot.classList.add(className);
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.background = bgColor;
    dot.style.borderColor = borderColor;
    dot.style.borderStyle = 'solid';
    dot.style.borderWidth = `${borderWidth}px`;
    dot.style.top = `${y - size / 2}px`;
    dot.style.left = `${x - size}px`;

    this.canvasWrapper.appendChild(dot);
  }

  addTextForCircle(x, y, fontSize, numberOfPoints, angle, index, firstDate) {
    const el = document.createElement('span');
    el.innerHTML = index;
    el.classList.add('number');
    el.style.fontSize = `${fontSize}px`;
    el.style.top = `${y - fontSize / 2}px`;
    el.style.left = `${x - fontSize}px`;

    const year = index - firstDate;
    el.style.transform = `rotate(${year < numberOfPoints / 2 ? angle : angle + Math.PI}rad)`;

    this.canvasWrapper.appendChild(el);
  }

  drawNumForCircle() {
    const { startDate, endDate, amountYear } = this.data;
    const startAngle = -Math.PI / 2 + Math.PI / amountYear; //-Math.PI / 2 + Math.PI / amountYear;
    const endAngle = startAngle + 2 * Math.PI;
    const numOfYears = endDate - startDate;
    const angleStep = (endAngle - startAngle) / amountYear;

    for (let i = 0; i <= amountYear; i++) {
      const angle = startAngle + i * angleStep;
      const size = 0.006;
      const fontSizeYear = this.canvas.width * size;
      const fontSizeWidth = this.radius / 2 + fontSizeYear;
      const numberX = this.centerX + (fontSizeWidth - 2) * Math.cos(angle);
      const numberY = this.centerY + (fontSizeWidth - 2) * Math.sin(angle);
      const el = document.createElement('span');
      el.innerHTML = i;

      if (i > numOfYears) el.style.opacity = '0';

      el.classList.add('number');
      el.style.fontSize = `${fontSizeYear}px`;
      el.style.top = `${numberY - fontSizeYear / 2}px`;
      el.style.left = `${numberX - fontSizeYear / 2}px`;
      el.style.transform = `rotate(${angle + Math.PI / 2}rad)`;
      el.style.fontWeight = '700';

      this.canvasWrapper.appendChild(el);
    }
  }

  drawTextForCategories() {
    const { categoryData, startDate, amountYear } = this.data;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + 2 * Math.PI;
    const angleStep = (endAngle - startAngle) / amountYear;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', this.canvas.width);
    svg.setAttribute('height', this.canvas.height);
    svg.style.position = 'absolute';
    svg.style.top = 0;
    svg.style.left = 0;
    svg.style.zIndex = 50;

    let remainingText = '';
    let zIndex = 60;

    categoryData.forEach((item, index) => {
      const { date, category } = item;
      const { from } = date;
      let { to } = date;
      const size = 0.01;
      const fontSize = this.canvas.width * size;
      const pathRadius = this.radius / 2 + fontSize * 2.5;
      let textContent = remainingText || category;
      remainingText = '';

      const tempText = document.createElementNS(svgNS, 'text');
      tempText.style.fontSize = `${fontSize}px`;
      tempText.textContent = textContent;
      svg.appendChild(tempText);
      svg.removeChild(tempText);

      const anglePerYear = angleStep;
      const anglePerPixel = anglePerYear / (2 * Math.PI * pathRadius);

      const additionalAngle = textContent.length * anglePerPixel;
      to = from + Math.ceil(to - from + additionalAngle / angleStep);

      const startAnglePath = startAngle + (from - startDate) * angleStep;
      let endAnglePath;

      if (textContent.length > to - from) {
        endAnglePath = startAngle + (to - startDate + (textContent.length - (to - from))) * angleStep;
      } else {
        endAnglePath = startAngle + (to - startDate) * angleStep;
      }

      const startX = this.centerX + pathRadius * Math.cos(startAnglePath);
      const startY = this.centerY + pathRadius * Math.sin(startAnglePath);

      const endX = this.centerX + pathRadius * Math.cos(endAnglePath);
      const endY = this.centerY + pathRadius * Math.sin(endAnglePath);

      const largeArcFlag = endAnglePath - startAnglePath <= Math.PI ? '0' : '1';

      const d = `
        M ${startX} ${startY}
        A ${pathRadius} ${pathRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      `;

      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('id', `path${index}`);
      path.setAttribute('fill', 'transparent');
      svg.appendChild(path);

      const textPath = document.createElementNS(svgNS, 'textPath');
      textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#path${index}`);

      if (textContent.length > (to - from) * 2) {
        textPath.setAttribute('startOffset', '0%');
      } else {
        textPath.setAttribute('startOffset', '30%');
      }

      textPath.textContent = textContent;
      textPath.style.fontSize = `${fontSize}px`;
      textPath.style.fill = '#333';
      textPath.style.backgroundColor = 'transparent';
      textPath.style.position = 'relative';
      textPath.style.zIndex = zIndex - 1;

      const text = document.createElementNS(svgNS, 'text');
      text.appendChild(textPath);
      svg.appendChild(text);

      const textElementLength = textPath.getComputedTextLength();
      const pathLength = path.getTotalLength();

      if (textElementLength > pathLength) {
        let splitIndex = Math.floor(textContent.length * (pathLength / textElementLength));
        remainingText = textContent.slice(splitIndex);
        textPath.textContent = textContent.slice(0, splitIndex);
      }
    });

    this.canvasWrapper.appendChild(svg);
  }

  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

new CanvasDrawer('canvas', '.canvas-wrapper', '.canvas-wrapper img', data);
