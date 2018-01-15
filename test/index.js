/* eslint-disable no-undef */
var chai = require('chai')
var cc = require('../src/index')

var expect = chai.expect

describe('change-object-case', function () {
  it('camelcase object', function () {
    var input = {
      string_field: 'string'
    }

    var fixture = {
      stringField: 'string'
    }
    expect(cc.camelcase(input)).to.deep.equal(fixture)
  })

  it('snakecase object', function () {
    var input = {
      stringField: 'string'
    }

    var fixture = {
      string_field: 'string'
    }
    expect(cc.snakecase(input)).to.deep.equal(fixture)
  })

  it('camelcase array', function () {
    var input = [
      {
        string_field: 'string'
      },
      {
        another_string_field: 'another_string'
      }
    ]

    var fixture = [
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
    var input = [
      {
        stringField: 'string'
      },
      {
        anotherStringField: 'another_string'
      }
    ]

    var fixture = [
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
      var input = {
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

      var fixture = {
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
        var now = new Date()

        var input = {
          stringField: 'string',
          dateField: now
        }

        var fixture = {
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

        var now = new Date()

        var input = {
          stringField: 'string',
          dateField: now
        }

        var fixture = {
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

        var now = new Date()

        var input = {
          stringField: 'string',
          dateField: now
        }

        var fixture = {
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
      var now = new Date()
      var input = {
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

      var fixture = {
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
