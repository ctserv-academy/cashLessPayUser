import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export const withRouter = (Comp) =>
    (props) => {
        const location = useLocation();
        // const navigate = useNavigate();
        // const params = useParams();

        return (
            <Comp {...props} routing={{ location, params: location.state }} />
        )



    }
