import React, { useState } from 'react';
import axios from 'axios';

import Info from '../Info';
import { useCart } from '../../hooks/useCart';

import styles from './Drawer.module.scss';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Drawer = ({ onClose, items = [], onRemove, opened }) => {
    const { cartItems, setCartItems, totalPrice } = useCart();
    const [isOrderComleted, setIsOrderCompleted] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onClickOrder = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.post(
                'https://6384e3f84ce192ac6066ac0f.mockapi.io/orders',
                { items: cartItems }
            );

            setOrderId(data.id);
            setIsOrderCompleted(true);
            setCartItems([]);

            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i];
                await axios.delete(
                    'https://6384e3f84ce192ac6066ac0f.mockapi.io/cart/' +
                        item.id
                );
                await delay(1000);
            }
        } catch (error) {
            alert('Ошибка при создании заказа :(');
        }
        setIsLoading(false);
    };
    return (
        <div
            className={`${styles.overlay} ${
                opened ? styles.overlayVisible : ''
            }`}
        >
            <div className={styles.drawer}>
                <h2 className="d-flex justify-between mb-30">
                    Корзина
                    <img
                        onClick={onClose}
                        className="cu-p"
                        src="/img/remove.svg"
                        alt="remove"
                    />
                </h2>

                {items.length > 0 ? (
                    <>
                        <div className={styles.items}>
                            {items.map((obj) => (
                                <div
                                    key={obj.id}
                                    className="cartItem d-flex align-center mb-20"
                                >
                                    <div
                                        style={{
                                            backgroundImage: `url(${obj.image})`,
                                        }}
                                        className="cartItemImg"
                                    ></div>
                                    <div className="mr-20 flex">
                                        <p className="mb-5">{obj.name}</p>
                                        <b>{obj.price}</b>
                                    </div>
                                    <img
                                        onClick={() => onRemove(obj.id)}
                                        className="removeBtn"
                                        src="/img/remove.svg"
                                        alt="remove"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="cartTotalBlock">
                            <ul>
                                <li className="d-flex">
                                    <span>Итого:</span>
                                    <div></div>
                                    <b>{totalPrice} руб. </b>
                                </li>
                                <li className="d-flex">
                                    <span>Налог 5%: </span>
                                    <div></div>
                                    <b>{(totalPrice / 100) * 5} руб. </b>
                                </li>
                            </ul>
                            <button
                                disabled={isLoading}
                                onClick={onClickOrder}
                                className="greenButton"
                            >
                                Оформить заказ
                                <img src="/img/arrow.svg" alt="arrow" />
                            </button>
                        </div>
                    </>
                ) : (
                    <Info
                        title={
                            isOrderComleted
                                ? 'Заказ оформлен!'
                                : 'Корзина пуста'
                        }
                        description={
                            isOrderComleted
                                ? `Ваш заказ #${orderId} скоро будет передан доставке`
                                : 'Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.'
                        }
                        image={
                            isOrderComleted
                                ? '/img/complete-order.jpg'
                                : '/img/empty-cart.jpg'
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default Drawer;
