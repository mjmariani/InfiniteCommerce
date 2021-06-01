import "./filterCard.css"
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function FilterCard({ suggestion }){

    return (
        <>
            <div className="filter-card">
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={suggestion.image} />
            <Card.Body>
                <Card.Title>{suggestion.title}</Card.Title>
                <Card.Text>
                {suggestion.title}
                </Card.Text>
                <Link to="/description"><Button variant="primary" >See Description</Button></Link>
                <Button variant="primary" href={suggestion.link}>Go to Amazon Link</Button>
            </Card.Body>
            </Card>
            </div>
        </>
        )
}

export default FilterCard;