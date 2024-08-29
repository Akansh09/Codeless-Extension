const css=`* {
    box-sizing: border-box;
  }
  body {
    background-image: linear-gradient(to bottom, #222, #444);
    color: #bbb;
    padding: 1rem;
    font-family: 'Playfair Display', serif;
  }
  
  h1 {
    text-align: center;
    font-family: 'Raleway', sans-serif;
  }
  h4{
    width:45%;
    text-align:center;
  }
  .tableHeading,.timeline{
   background-color:white;
   color:black;
   width:46%;
  }
  table,th,td{
    border: 1px solid black;
    border-spacing: 5px;
    border-collapse:collapse;
    margin:2px;
    text-align:center;
  }
  
  `;
  const doc = "<head><link href='https://fonts.googleapis.com/css?family=Playfair+Display|Raleway' rel='stylesheet'><title>Performance Of WebSite opened</title><style>"+css+"</style></head><body><h1>Performance of Requested Web Page</h1>"
  const bodyClose ="</body>";