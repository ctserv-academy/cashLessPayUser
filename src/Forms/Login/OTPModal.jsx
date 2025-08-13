import React, { useCallback } from 'react'
import InputNumericComp from '../../ReusableComponents/InputNumericComponent/InputNumericComp';
import Countdown from 'react-countdown';
import ButtonComponent from '../../ReusableComponents/Button/ButtonComponent';

export default function OTPModal({ otpCode, handleChange, timeLeft, resendCode, timerCounter, onAccept, ErrorOTPClass, ErrorOTPTxt }) {

    const renderer = useCallback(({ completed, formatted }) => {
        if (timerCounter < 3) {
            if (completed) {
                return <div style={{ float: 'right' }}><ButtonComponent
                    onClick={resendCode}
                    description={'Resend Code'}
                // className="btn btn-custom btn-block px-2 pointer"
                /></div>
            } else {
                return (
                    <div style={{ float: 'right' }}>
                        {formatted.hours}:{formatted.minutes}:{formatted.seconds}
                    </div>
                );
            }
        } else {
            return <div><b>You have exceeded the number of OTP requests per hour. Please try again later</b></div>
        }
    }, [resendCode, timerCounter]);

    return (
        <div className='row'>
            {ErrorOTPTxt && <div className={ErrorOTPClass}>{ErrorOTPTxt}</div>}
            <div className="col-12">Enter your OTP Code</div>
            <div className="col-12 mt-2">
                <InputNumericComp
                    value={otpCode}
                    name="otpCode"
                    maxLength={4}
                    handleChange={handleChange}
                />
            </div>
            <div className="col-12 mt-4">
                <ButtonComponent
                    onClick={onAccept}
                    description={'Submit'}
                    style={{ float: 'right', marginLeft: '10px' }}
                    className='btn btn-custom'
                />
                <Countdown key={timerCounter} date={Date.now() + timeLeft} renderer={renderer} />
            </div>
        </div>
    )
}