import Alert from 'react-bootstrap/Alert'
import React from 'react';
function AlertDismissible({msg}) {
    //const [show, setShow] = useState(true);
  
      return (
        <Alert variant="danger" >
          <Alert.Heading>{msg}</Alert.Heading>
        </Alert>
      );
  }
  
export default AlertDismissible;