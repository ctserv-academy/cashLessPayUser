import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import './RewardsPoints.css'
import { LoadingContext } from '../../ContextProviders/LoadingContext';
import { ToastNotificationContext } from '../../ContextProviders/ToastNotificationContext';
import { AuthContext } from '../../ContextProviders/AuthContext';
import { FetchData, formatNumber, set } from '../../Helpers/utils';
import { urlPath } from '../../globals';


export default function RewardsPoints() {
    const { setLoadingCounter } = useContext(LoadingContext);
    const { showToastNotification } = useContext(ToastNotificationContext);
    const { clientData, setClientData } = useContext(AuthContext);
    const [rewardPoints, setRewardPoints] = useState([]);
    const [dataToLoad, setDataToLoad] = useState(1);
    const [lastDate, setLastDate] = useState('');
    const [showLoadMore, setShowLoadMore] = useState(true);

    const controller = useRef(null);

    useEffect(() => {
        controller.current = new AbortController();
        return () => {
            controller.current.abort()
        }
    }, []);

    const drawList = useCallback(() => {

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return rewardPoints.map((element, idx) => {
            var monthIndex = new Date(element.groupedTotal[0]?.monthGroup + '-01').getMonth();

            return <div key={idx} className='col-12 rewardsPointsDetails' >
                <div className='monthCard'>
                    <div className='monthCardHeader row'>
                        <h6 className='col-6'>{monthNames[monthIndex]}</h6>
                        <h6 className='col-6' style={{ textAlign: "right" }}>{element.groupedTotal[0]?.points} Points</h6>
                    </div>
                    <div className='monthCardBody'>
                        {element.statements.map((statement, sidx) => {
                            return (
                                <div className='row' key={sidx}>
                                    <div className='col-6'>
                                        <div className="visitDate">{statement.date}</div>
                                        <div className="branchVisited">{statement.locDesc}</div>

                                    </div>
                                    <div className='col-6' style={{ paddingTop: "16px", textAlign: "right" }}>
                                        {statement.points > 0 ? '+' : ''}
                                        {statement.points}
                                        <span> Points</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        })


    }, [rewardPoints])

    const fetchRewardPoints = useCallback(async (loadMore) => {
        try {
            if (!clientData) { return }
            setLoadingCounter(prv => prv + 1);


            const body = {
                _CardNumber: clientData.cardNumber,
                _Date: loadMore ? lastDate : ''

            };
            let data = await FetchData(`${urlPath}GetStatementListGrouped`, 'post', body, null, controller.current.signal);
            // console.log(JSON.parse(data.GetCountryCodesResult))
            data = JSON.parse(data.GetStatementListGroupedResult);
            // data = JSON.parse(data);
            if (!data) {
                setShowLoadMore(false);
                return
            }
            setLastDate(data.lastDate);
            if (!data.lastDate) {
                setShowLoadMore(false);
            }
            if (loadMore) {
                setRewardPoints(prv => [...prv, { ...data }])
            }
            else {
                setRewardPoints([data])
            }



        }
        catch (err) {
            showToastNotification("An Error Has Occured", false)
            console.log(err)
        }
        finally {
            setLoadingCounter(prv => prv - 1);
        }

    }, [clientData, lastDate])

    const refreshClientData = useCallback(async () => {
        try {

            if (!clientData) {
                return
            }
            setLoadingCounter(prv => prv + 1);

            const body = {
                _countryCode: clientData.countryCode,
                _phone: clientData.phone,
                _register: false

            };
            let data = await FetchData(`${urlPath}GetClientData`, 'post', body, null, controller.current.signal);

            const { locationID, RecID: clientID, clientName, cardPrefix,
                cardNumber, balance, pointsConversion, pointsValue,
                verificationCode } = JSON.parse(data.GetClientDataResult)[0]
            await set('clientData', {
                ...clientData,
                locationID, clientID, clientName, cardPrefix,
                cardNumber, balance, pointsConversion, pointsValue,
                verificationCode, countryCode: clientData.countryCode
            });
            setClientData({
                ...clientData,
                locationID, clientID, clientName, cardPrefix,
                cardNumber, balance, pointsConversion, pointsValue,
                verificationCode, countryCode: clientData.countryCode
            })



        }
        catch (err) {
            showToastNotification("An Error Has Occured", false)
            console.log(err)
        }
        finally {
            setLoadingCounter(prv => prv - 1);
        }
    }, [clientData])


    useEffect(() => {
        refreshClientData()
    }, [])

    useEffect(() => {
        if (clientData) {
            console.log('ClientData', clientData)
            fetchRewardPoints();
        }

    }, [clientData])

    return (
        <div id="rewardsPointsMainContainer">
            <div className='row'>

            </div>
            <div className='rewardPointsDivision'>
                <h3>{clientData?.balance ? formatNumber(parseFloat(clientData?.balance), 0, 3) : '0'}</h3>
                <div>points</div>
                <div>
                    <>
                        {clientData?.balance ? formatNumber(parseFloat(clientData?.balance) * (clientData?.pointsValue ? parseFloat(clientData?.pointsValue) : 0), 0, 3) : '0'} LBP
                    </>
                </div>
            </div>
            <h3 className='pageTitle'>Rewards Points</h3>
            <div className='ps-1 pe-1'>
                {
                    drawList()
                }

                {showLoadMore &&
                    <div id="loadMore" onClick={() => {
                        fetchRewardPoints(true)
                    }}>Load more...</div>
                }
            </div>
        </div>
    )

}

