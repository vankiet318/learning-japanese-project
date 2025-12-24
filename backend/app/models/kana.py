class Kana(Base):
    __tablename__ = "kana"

    id = Column(Integer, primary_key=True)
    character = Column(String, nullable=False)
    romaji = Column(String, nullable=False)
    type = Column(String, nullable=False)
