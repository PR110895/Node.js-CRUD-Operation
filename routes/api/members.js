const express = require("express");
// const uuid = require("uuid");
const router = express.Router();
const members = require("../../members");
const validator = require("email-validator");

//Get all members
router.get("/", (req, res) => {
  res.json(members);
});

//Get Single Member
router.get("/:id", (req, res) => {
  const found = members.some((member) => member.id === parseInt(req.params.id));
  if (found) {
    res.json(members.filter((member) => member.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

//Create Members
router.post("/", (req, res) => {
  // res.send(req.body);
  const newMember = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  //Validation Name and Email

  if (!newMember.name || !newMember.email) {
    return res
      .status(441)
      .json({ msg: "Please include a valid name and email" });
  }

  //Validation of name
  if (newMember.name.length <= 7) {
    return res.status(441).json({ msg: "Please include a valid Full Name" });
  }

  //Validation of email
  if (!validator.validate(newMember.email)) {
    return res
      .status(400)
      .json({ msg: "Please include a valid email(With @ and .)" });
  }

  //Validation of phone

  const alphaNumVali = /[a-zA-Z]/.test(newMember.phone);

  if (newMember.phone.length > 1 && newMember.phone.length != 10) {
    return res.status(400).json({ msg: "Please include a valid PhoneNumber" });
  }

  if (alphaNumVali) {
    return res
      .status(400)
      .json({ msg: "Please don't include alphabet in PhoneNumber" });
  }

  //Check member alredy exist or not
  if (
    members.find(
      (user) =>
        user.id === req.body.id ||
        user.email === req.body.email ||
        user.phone === req.body.phone ||
        user.name === req.body.name
    )
  ) {
    return res.status(422).json({
      message: `User alredy exist with name: ${req.body.name}, email: ${req.body.email},phone: ${req.body.phone}`,
    });
  }

  members.push(newMember);
  res.status(200).json({
    message: `New member added to list`,
    member: newMember,
  });
  // res.json(newMember);
  // res.redirect("/");
});

//Update Members
router.put("/:id", (req, res) => {
  // res.send(req.params.id);
  const found = members.some((member) => member.id === parseInt(req.params.id));
  if (found) {
    const updMember = req.body;

    ///Validation of Update Member
    if (!req.body) {
      return res
        .status(400)
        .send({ message: "Data to update can not be empty" });
    }
    if (updMember.name) {
      //Validation of name
      if (updMember.name.length <= 7) {
        return res
          .status(441)
          .json({ msg: "Please include a valid Full Name" });
      }
    }
    if (updMember.email) {
      //Validation of email
      if (!validator.validate(updMember.email)) {
        return res
          .status(400)
          .json({ msg: "Please include a valid email(With @ and .)" });
      }
    }
    if (updMember.phone) {
      //Validation of phone

      const alphaNumVali = /[a-zA-Z]/.test(updMember.phone);

      if (updMember.phone.length > 1 && updMember.phone.length != 10) {
        return res
          .status(400)
          .json({ msg: "Please include a valid PhoneNumber" });
      }

      if (alphaNumVali) {
        return res
          .status(400)
          .json({ msg: "Please don't include alphabet in PhoneNumber" });
      }
    }
    members.forEach((member) => {
      if (member.id === parseInt(req.params.id)) {
        member.name = updMember.name ? updMember.name : member.name;
        member.email = updMember.email ? updMember.email : member.email;
        member.phone = updMember.phone ? updMember.phone : member.phone;

        res.json({
          msg: `Member updated with ${
            (updMember.name, updMember.email, updMember.phone)
          }`,
          member,
        });
      }
    });
  } else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

// Deleate Member
router.delete("/:id", (req, res) => {
  const found = members.some((member) => member.id === parseInt(req.params.id));
  if (found) {
    members.pop(found);
    res.status(200).json({
      msg: `Member deleted! member id: ${req.params.id}`,
      members: members.filter(
        (member) => member.id !== parseInt(req.params.id)
      ),
    });
  } else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

module.exports = router;
