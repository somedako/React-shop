import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Header = (props) => {
    const { totalPrice } = useCart();

    return (
        <header className="d-flex justify-between">
            <Link to={'/'}>
                <div className="d-flex align-center">
                    <img
                        width={40}
                        height={40}
                        src="/img/logo.svg"
                        alt="logo"
                    />
                    <div>
                        <h3 className="text-uppercase">React Sneakers</h3>
                        <p className="opacity-5">Магазин лучших кросовок</p>
                    </div>
                </div>
            </Link>
            <ul className="d-flex">
                <li onClick={props.onClickCart} className="mr-30 cu-p">
                    <img
                        width={18}
                        height={18}
                        src="/img/card.svg"
                        alt="logo"
                    />
                    <span>{totalPrice} руб.</span>
                </li>
                <li>
                    <Link to={'/favorites'}>
                        <img
                            className="mr-20 cu-p"
                            width={18}
                            height={18}
                            src="/img/heart.svg"
                            alt="Заклдаки"
                        />
                    </Link>
                </li>
                <li>
                    <Link to={'/orders'}>
                        <img
                            width={18}
                            height={18}
                            src="/img/user.svg"
                            alt="logo"
                        />
                    </Link>
                </li>
            </ul>
        </header>
    );
};

export default Header;
