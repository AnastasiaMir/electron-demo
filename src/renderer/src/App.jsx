import { useEffect, useState } from "react"
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import ico from './assets/ico.png'

function App() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  useEffect(() => {
    const gettingP = async () => {
      const res = await window.api.getPartners();
      setPartners(res)
    }
    gettingP()
  }, [])

  return (
    <>
      <div className="page-heading">
        <img className="page-logo" src={ico} alt="" />
        <h1>Партнеры</h1>
      </div>
      <ul className="partners-list">
        {partners.map((partner) => {
          return <li className="partner-card" key={partner.id} onClick={() => { navigate('/update', { state: { partner } }) }}>
            <div className="partner-data">
              <p className="card_heading">{partner.company_type_name} | {partner.name}</p>
              <div className="partner-data-info">
                <p>{partner.director}</p>
                <p>{partner.phone}</p>
                <p>Рейтинг: {partner.rating}</p>
              </div>
            </div>
            <div className="partner-sale partner-data card_heading">
              {partner.discount}%
            </div>
          </li>
        })}
      </ul>

      <Link to={'/create'}>
        <button>
          Создать партнера
        </button>
      </Link>
    </>
  )
}

export default App

