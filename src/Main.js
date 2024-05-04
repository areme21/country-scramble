import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import './Main.css';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import countriesData from './countries.json';
import shuffle from 'lodash/shuffle';
import { password, welcomeMessage, welcomeMessageHeader, welcomeMessageFooter } from "./private/Password";

// gets harder as you go... either less countries as possible answers, less time, more letters
// maybe start with 2 letters, then 3 

const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", 
"Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
"Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
"Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", 
"Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", 
"Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", 
"Colombia", "Comoros", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia",
"Czech Republic", "Democratic Republic of the Congo", "Democratic Republic of Congo", "Denmark", "Djibouti", 
"Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", 
"Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
"Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", 
"Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", 
"India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", 
"Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
"Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", 
"Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", 
"Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", 
"Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", 
"Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "the Netherlands","New Zealand", 
"Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman",
"Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
"Qatar",
"Republic of the Congo", "Republic of Congo", "Romania", "Russia", "Rwanda",
"Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria",
"Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
"Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States of America","Uruguay", "Uzbekistan",
"Vanuatu", "Vatican City", "Venezuela", "Vietnam",
"Yemen",
"Zambia", "Zimbabwe"]
// const isAnswerPossible = (letters) => {
//     for (let i = 0; i < countries.length; i++) {
//         let country = countries[i].toLowerCase();
        
//         if (letters.every(letter => country.includes(letter))) {
//             return true
//         }
//     };
//     return false;
// }
const lettersValidCountry = (letters, country) => {
    const letterCounts = {};
    for (const letter of letters) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
    for (const letter in letterCounts) {
        const letterCountInCountry = (country.match(new RegExp(letter, 'gi')) || []).length;
        if (letterCountInCountry < letterCounts[letter]) {
            return false;
        }
    }
    return true;
}
const numAnswers = (letters) => {
    let num = 0
    for (let i = 0; i < countries.length; i++) {
        let country = countries[i].toLowerCase()
        if (lettersValidCountry(letters, country)) {
            num += 1
        }
    };
    return num;
}
const possibleAnswers = (letters) => {
    let poss = []
    for (let i = 0; i < countries.length; i++) {
        let country = countries[i].toLowerCase()
        if (lettersValidCountry(letters, country)) {
            poss.push(country)
        }
    };
    return poss;
}
const isAnswerCorrect = (letters, answer) => {
    let countries_lower = countries.map((country) => country.toLowerCase());
    return countries_lower.includes(answer.toLowerCase()) && 
    possibleAnswers(letters).includes(answer.toLowerCase());
}
const generateLetters = (numLetters) => {
    let letters = 'abcdefghijklmnopqrstuvwxyz';
    let generatedLetters = [];
    for (let i = 0; i < numLetters; i++) {
        let ind = Math.floor(Math.random() * letters.length);
        // if (!(generatedLetters.includes(letters[ind]))) {
        generatedLetters.push(letters[ind]);
        // }
    }
    if (numAnswers(generatedLetters) >= 3 && generatedLetters.length === numLetters) {
        return generatedLetters;
    }
    else {
        return generateLetters(numLetters)
    }
}


function CountryScramble({ goToMessage }) {
    const [letters, setLetters] = useState([]);
    const [answer, setAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [lostGame, setLostGame] = useState(false);
    const [timer, setTimer] = useState(30);
    const [highScore, setHighScore] = useState(0);
    const [bonuses, setBonuses] = useState(0);
    const [flagQuestion, setFlagQuestion] = useState(null);
    const [flagOptions, setFlagOptions] = useState([]);
    const filteredCountryCodes = Object.keys(countriesData).filter(code => countries.includes(countriesData[code]));

    const getRandomCountryCode = (correctCountry) => {
        const randomIndex = Math.floor(Math.random() * filteredCountryCodes.length);
        if (filteredCountryCodes[randomIndex] !== correctCountry) {
            return filteredCountryCodes[randomIndex];
        }
        else {
            getRandomCountryCode(correctCountry)
        }
    };
    const getRandomFlags = (correctCountry) => {
        const randomFlags = [];
        for (let i = 0; i < 3; i++) {
            const randomCountryCode = getRandomCountryCode(correctCountry);
            randomFlags.push(randomCountryCode);
        }
        return randomFlags;
    };
    useEffect(() => {
        const generatedLetters = generateLetters(3);
        setLetters(generatedLetters);
    }, []); 
    useEffect(() => {
        if (gameStarted && !lostGame && timer > 0) {
            const countdown = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearTimeout(countdown);
        } else if (timer === 0) {
            setLostGame(true);
        }
    }, [gameStarted, lostGame, timer]);
    useEffect(() => {
        const storedHighScore = localStorage.getItem('highScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore));
        }
    }, []);
    const LettersDisplay = ({letters}) => {
        const spaced = letters.map(letter => letter.toUpperCase()).join(', ');
        return(
            <div>
                {spaced}
            </div>
        );
    };
    const handleSubmit = () => {
        if (flagQuestion) {
            const correctCountry = countriesData[flagQuestion.code];
            if (correctCountry === answer) {
                setScore(score + 10);
                let generatedLetters = generateLetters(3);
                setLetters(generatedLetters);
                setAnswer('');
                setTimer(30);
                setFlagQuestion(null);
                setFlagOptions([]);
            } else {
                setLostGame(true);
            }
        } else if (isAnswerCorrect(letters, answer)) {
            const newScore = score + 10;
            setScore(newScore);
            if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('highScore', newScore);
            }
            if ((score + 10) % 50 === 0) { 
                setBonuses(bonuses + 1);
            }
            let generatedLetters = generateLetters(3);
            setLetters(generatedLetters);
            setAnswer('');
            setTimer(30);
        }
        else {
            if (bonuses > 0) {
                const countryCode = getRandomCountryCode();
                setLostGame(false);
                setBonuses(bonuses - 1);
                setFlagQuestion({ code: countryCode });
                const randomFlags = getRandomFlags(countryCode);
                randomFlags.push(countryCode)
                const flags = shuffle(randomFlags);
                setFlagOptions(flags);
            }
            else {
                setLostGame(true);
            }
        } 
    };
    const handleStartGame = () => {
        setGameStarted(true);
        setLostGame(false);
        setAnswer('');
        let generatedLetters = generateLetters(3);
        setLetters(generatedLetters);
        setScore(0);
        setTimer(30);
        setBonuses(0);
        setFlagQuestion(null);
        setFlagOptions([]);
    };
    const handleNewGame = () => {
        setGameStarted(false);
        setScore(0);
        setBonuses(0);
        setFlagQuestion(null);
        setFlagOptions([]);
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    const handleFlagOptionClick = (selectedCountry) => {
        if (selectedCountry === countriesData[flagQuestion.code]) {
            let generatedLetters = generateLetters(3);
            setLetters(generatedLetters);
            setAnswer('');
            setTimer(30);
            setFlagQuestion(null);
            setFlagOptions([]);
        } else {
            if (bonuses > 0) {
                const countryCode = getRandomCountryCode();
                setLostGame(false);
                setBonuses(bonuses - 1);
                setFlagQuestion({ code: countryCode });
                const randomFlags = getRandomFlags(countryCode);
                randomFlags.push(countryCode)
                const flags = shuffle(randomFlags);
                setFlagOptions(flags);
            }
            else {
                setLostGame(true);
            }
        }
    };
    const handleGiveUp = () => {
        if (bonuses > 0) {
            const countryCode = getRandomCountryCode();
            setLostGame(false);
            setBonuses(bonuses - 1);
            setFlagQuestion({ code: countryCode });
            const randomFlags = getRandomFlags(countryCode);
            randomFlags.push(countryCode)
            const flags = shuffle(randomFlags);
            setFlagOptions(flags);
        }
        else {
            setLostGame(true);
        }
    };
    return (
        <div>
        <div className="scramble-header">
        <h1>Country Scramble</h1>
        </div>
        <div >
        <Button style={{ width: '200px', height: '100px',fontSize: '20px', fontWeight: 'bold', backgroundColor: 'orange', padding: '8px', cursor: 'grab', bottom: 0, right: 0, position: 'fixed' }} onClick={() => goToMessage()}>Go Back to Message</Button>
        </div>
        <div className="high-score">
            High Score: {highScore}
        </div>
        {/* <input
            type="text"
            value={enteredPass}
            onChange={(e) => setEnteredPass(e.target.value)}
            placeholder="Enter password"
            style={{ width: '300px', fontSize: '16px', padding: '8px', marginTop: '10px' }}
        ></input>
        <Button onClick={handlePassSubmit} style={{ width: '150px', fontSize: '16px', padding: '8px', marginLeft: '10px', cursor: 'grab' }}>Submit Password</Button> */}
        {gameStarted &&
        <div className="score-bonus">
        <div className="score">
            Score: <span style={{ color: gameStarted && lostGame ? '#e53935' : score > 0 ? 'lime' : 'white' }}>{score}</span>
        </div>
        {!lostGame &&
        <div className="bonus">
            Bonuses: {bonuses}
        </div>
        }
        </div>
    }
            <div>
                {gameStarted && !lostGame &&
                <div>
                                    {flagQuestion ? (
                    <div>
                                                <p>Which is the flag of {countriesData[flagQuestion.code]}?</p>
                        <div className="flag-options">
                        {flagOptions.map(flagCode => (
                                <span key={flagCode} 
                                className={`fi fi-${flagCode.toLowerCase()}`} 
                                onClick={() => handleFlagOptionClick(countriesData[flagCode])}></span>
                            ))}
                        </div>
                    </div>
                        ) : (
                            <div>
                                <p>Think of a country containing the letters:</p>
                            <LettersDisplay letters={letters}/>
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter a country..."
                                className="input-box"
                                style={{ width: '300px', fontSize: '16px', padding: '8px', marginTop: '10px' }}
                            />
                            {!lostGame && <Button onClick={handleSubmit} style={{ width: '150px', fontSize: '16px', padding: '8px', marginLeft: '10px', cursor: 'grab' }}>Submit</Button>}
                            <p>Time left: <span style={{color: timer <= 5 && 'red'}}>{timer}</span> seconds</p>
                            </div>
                            )}
                        </div>
            }
                    {gameStarted && lostGame && 
        <div>
        <div style={{ fontWeight: 'bold', color: 'red'}}>Game Over :(</div>
        <Button onClick={handleNewGame} style={{ width: '150px', fontSize: '16px', padding: '8px', marginTop: '10px', cursor: 'grab' }}>New Game</Button>
        </div>}
        {gameStarted && !lostGame &&
        <Button onClick={handleGiveUp} style={{ width: '150px', fontSize: '16px', padding: '8px', marginTop: '10px', cursor: 'grab' }}>Give Up</Button>}
        {!gameStarted && 
        <div>
        <div>
        <p>In this game, you'll be given a set of letters. </p>
        <p>You have 30 seconds to guess the name of a country that contains all of these letters.</p>
        <p>For every 5 correct answers, you'll earn 1 bonus chance. </p>
        <p>If your answer is incorrect, you lose... </p>
        <p>Unless you have a bonus, which gives you the opportunity to continue playing by completing a flag quiz.</p>
        <p>Good Luck!</p>
        </div>
        <Button onClick={handleStartGame} style={{ width: '150px', fontSize: '16px', padding: '8px', marginTop: '10px', cursor: 'grab' }}>{"Start"}</Button>
        </div>
        }
        </div>
    </div>
    )

}

export default function Main() {
    const [enteredPass, setEnteredPass] = useState('');
    const [correctPass, setCorrectPass] = useState(false);
    const [showGame, setShowGame] = useState(false);

    // console.log(possibleAnswers(letters));

    const handlePassSubmit = () => {
        if (enteredPass === password) {
            setCorrectPass(true);
        }
    };

    const handleGoToGame = () => {
        setShowGame(true);
    };

    const handleGoToMessage = () => {
        setShowGame(false);
        setCorrectPass(false);
    };

    if (correctPass && showGame) {
        return <CountryScramble goToMessage={handleGoToMessage} />;
    }

    if (correctPass && !showGame) {
        return (
            <div>
                                <h2>{welcomeMessageHeader}</h2>
                <div style={{ width: '600px'}}>
                {welcomeMessage}
                </div>
                <h2>{welcomeMessageFooter}</h2>
                <Button style={{ width: '150px', fontSize: '16px', padding: '8px', marginLeft: '10px', cursor: 'grab' }} onClick={handleGoToGame}>Go to game</Button>
            </div>
        );
    }
    return (
        <div>
            <input
                type="password"
                value={enteredPass}
                onChange={(e) => setEnteredPass(e.target.value)}
                placeholder="Enter password"
                style={{ width: '300px', fontSize: '16px', padding: '8px', marginTop: '10px' }}
            ></input>
            <Button onClick={handlePassSubmit} style={{ width: '150px', fontSize: '16px', padding: '8px', marginLeft: '10px', cursor: 'grab' }}>Submit Password!</Button>
        </div>
    );
};
