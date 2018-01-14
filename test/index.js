/* eslint-disable no-undef */
import chai from 'chai'
import cc from '../src/index'

let expect = chai.expect

describe('change-object-case', function () {
  it('camelcase object', function () {
    let input = {
      string_field: 'string'
    }

    let fixture = {
      stringField: 'string'
    }
    expect(cc.camelcase(input)).to.deep.equal(fixture)
  })

  it('snakecase object', function () {
    let input = {
      stringField: 'string'
    }

    let fixture = {
      string_field: 'string'
    }
    expect(cc.snakecase(input)).to.deep.equal(fixture)
  })

  it('camelcase array', function () {
    let input = [
      {
        string_field: 'string'
      },
      {
        another_string_field: 'another_string'
      }
    ]

    let fixture = [
      {
        stringField: 'string'
      },
      {
        anotherStringField: 'another_string'
      }
    ]
    expect(cc.camelcase(input)).to.deep.equal(fixture)
  })

  it('snakecase array', function () {
    let input = [
      {
        stringField: 'string'
      },
      {
        anotherStringField: 'another_string'
      }
    ]

    let fixture = [
      {
        string_field: 'string'
      },
      {
        another_string_field: 'another_string'
      }
    ]
    expect(cc.snakecase(input)).to.deep.equal(fixture)
  })

  describe('nested object', function () {
    it('camelcase', function () {
      let input = {
        stringField: 'string',
        integerField: 10,
        floatField: 10.5,
        booleanFieldTrue: true,
        booleanFieldFalse: false,
        arrayField: [
          {
            stringField: 'string',
            integerField: 10,
            floatField: 10.5,
            booleanFieldTrue: true,
            booleanFieldFalse: false,
            arrayField: [
              {
                stringField: 'string',
                integerField: 10,
                floatField: 10.5,
                booleanFieldTrue: true,
                booleanFieldFalse: false,
              }
            ]
          },
          {
            stringField: 'string',
            integerField: 10,
            floatField: 10.5,
            booleanFieldTrue: true,
            booleanFieldFalse: false,
          }
        ],
        objectField: {
          stringField: 'string',
          integerField: 10,
          floatField: 10.5,
          booleanFieldTrue: true,
          booleanFieldFalse: false,
          arrayField: [
            {
              stringField: 'string',
              integerField: 10,
              floatField: 10.5,
              booleanFieldTrue: true,
              booleanFieldFalse: false,
              arrayField: [
                {
                  stringField: 'string',
                  integerField: 10,
                  floatField: 10.5,
                  booleanFieldTrue: true,
                  booleanFieldFalse: false,
                }
              ]
            },
            {
              stringField: 'string',
              integerField: 10,
              floatField: 10.5,
              booleanFieldTrue: true,
              booleanFieldFalse: false,
            }
          ]
        }
      }

      let fixture = {
        string_field: 'string',
        integer_field: 10,
        float_field: 10.5,
        boolean_field_true: true,
        boolean_field_false: false,
        array_field: [
          {
            string_field: 'string',
            integer_field: 10,
            float_field: 10.5,
            boolean_field_true: true,
            boolean_field_false: false,
            array_field: [
              {
                string_field: 'string',
                integer_field: 10,
                float_field: 10.5,
                boolean_field_true: true,
                boolean_field_false: false,
              }
            ]
          },
          {
            string_field: 'string',
            integer_field: 10,
            float_field: 10.5,
            boolean_field_true: true,
            boolean_field_false: false,
          }
        ],
        object_field: {
          string_field: 'string',
          integer_field: 10,
          float_field: 10.5,
          boolean_field_true: true,
          boolean_field_false: false,
          array_field: [
            {
              string_field: 'string',
              integer_field: 10,
              float_field: 10.5,
              boolean_field_true: true,
              boolean_field_false: false,
              array_field: [
                {
                  string_field: 'string',
                  integer_field: 10,
                  float_field: 10.5,
                  boolean_field_true: true,
                  boolean_field_false: false,
                }
              ]
            },
            {
              string_field: 'string',
              integer_field: 10,
              float_field: 10.5,
              boolean_field_true: true,
              boolean_field_false: false,
            }
          ]
        }
      }
      expect(cc.snakecase(input)).to.deep.equal(fixture)
    })
  })

  describe('options test', function () {
    describe('ignoreClass', function () {
      it('should not same on Date type', function () {
        // 디폴트 옵션 사용
        let now = new Date()

        let input = {
          stringField: 'string',
          dateField: now
        }

        let fixture = {
          string_field: 'string',
          date_field: now
        }

        expect(cc.snakecase(input)).to.not.deep.equal(fixture)
      })

      it('should same on Date type with ignoreClass option', function () {
        // option 으로 옵션 변경
        cc.option({
          ignoreClass: []
        })

        let now = new Date()

        let input = {
          stringField: 'string',
          dateField: now
        }

        let fixture = {
          string_field: 'string',
          date_field: now
        }

        expect(cc.snakecase(input)).to.not.deep.equal(fixture)
      })

      it('should same', function () {
        // option 으로 옵션 변경후 oneOff option 으로 다시 정상적인 옵션 사용

        cc.option({
          ignoreClass: ['Date']
        })

        let now = new Date()

        let input = {
          stringField: 'string',
          dateField: now
        }

        let fixture = {
          string_field: 'string',
          date_field: now
        }

        expect(cc.snakecase(input)).to.deep.equal(fixture)
      })
    })
  })

  describe('nested object with option', function () {
    it('should same', function () {
      cc.option({
        ignoreClass: ['Date']
      })
      let now = new Date()
      let input = {
        stringField: 'string',
        integerField: 10,
        floatField: 10.5,
        booleanFieldTrue: true,
        booleanFieldFalse: false,
        dateField: now,
        arrayField: [
          {
            stringField: 'string',
            integerField: 10,
            floatField: 10.5,
            booleanFieldTrue: true,
            booleanFieldFalse: false,
            dateField: now,
            arrayField: [
              {
                stringField: 'string',
                integerField: 10,
                floatField: 10.5,
                booleanFieldTrue: true,
                booleanFieldFalse: false,
                dateField: now
              }
            ]
          },
          {
            stringField: 'string',
            integerField: 10,
            floatField: 10.5,
            booleanFieldTrue: true,
            booleanFieldFalse: false,
            dateField: now
          }
        ],
        objectField: {
          stringField: 'string',
          integerField: 10,
          floatField: 10.5,
          booleanFieldTrue: true,
          booleanFieldFalse: false,
          dateField: now,
          arrayField: [
            {
              stringField: 'string',
              integerField: 10,
              floatField: 10.5,
              booleanFieldTrue: true,
              booleanFieldFalse: false,
              dateField: now,
              arrayField: [
                {
                  stringField: 'string',
                  integerField: 10,
                  floatField: 10.5,
                  booleanFieldTrue: true,
                  booleanFieldFalse: false,
                  dateField: now
                }
              ]
            },
            {
              stringField: 'string',
              integerField: 10,
              floatField: 10.5,
              booleanFieldTrue: true,
              booleanFieldFalse: false,
              dateField: now
            }
          ]
        }
      }

      let fixture = {
        string_field: 'string',
        integer_field: 10,
        float_field: 10.5,
        boolean_field_true: true,
        boolean_field_false: false,
        date_field: now,
        array_field: [
          {
            string_field: 'string',
            integer_field: 10,
            float_field: 10.5,
            boolean_field_true: true,
            boolean_field_false: false,
            date_field: now,
            array_field: [
              {
                string_field: 'string',
                integer_field: 10,
                float_field: 10.5,
                boolean_field_true: true,
                boolean_field_false: false,
                date_field: now
              }
            ]
          },
          {
            string_field: 'string',
            integer_field: 10,
            float_field: 10.5,
            boolean_field_true: true,
            boolean_field_false: false,
            date_field: now
          }
        ],
        object_field: {
          string_field: 'string',
          integer_field: 10,
          float_field: 10.5,
          boolean_field_true: true,
          boolean_field_false: false,
          date_field: now,
          array_field: [
            {
              string_field: 'string',
              integer_field: 10,
              float_field: 10.5,
              boolean_field_true: true,
              boolean_field_false: false,
              date_field: now,
              array_field: [
                {
                  string_field: 'string',
                  integer_field: 10,
                  float_field: 10.5,
                  boolean_field_true: true,
                  boolean_field_false: false,
                  date_field: now
                }
              ]
            },
            {
              string_field: 'string',
              integer_field: 10,
              float_field: 10.5,
              boolean_field_true: true,
              boolean_field_false: false,
              date_field: now
            }
          ]
        }
      }
      expect(cc.snakecase(input)).to.deep.equal(fixture)
    })
  })
})
